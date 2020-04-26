import { Backdrop, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ChannelListCard, MessageBox } from "components/Message";
import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { useInView } from "react-intersection-observer";
import { useHistory, useParams } from "react-router-dom";
import { ChannelHandler, GroupChannel, GroupChannelListQuery } from "sendbird";
import { useAuth, useChannel } from "stores";
import { isGroupChannel, parseChannel } from "./utils";
import { ChannelCustomType } from "@frankyjuang/milkapi-client";

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    flex: 1,
    flexDirection: "row",
  },
  channelListContainer: {
    position: "relative",
    border: "1px solid #EBEBEB",
    flex: 1,
    minWidth: 320,
    maxWidth: 420,
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  chatContainer: {
    display: "flex",
    flex: 3,
    position: "relative",
  },
  permissionButton: {
    backgroundColor: theme.palette.secondary.main,
    padding: 16,
    color: "white",
    fontSize: 16,
    fontWeight: 700,
    "&:hover": {
      cursor: "pointer",
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
}));

interface Props {
  isRecruiter?: boolean;
}

const ChatRoom: React.FC<Props> = ({ isRecruiter }) => {
  const classes = useStyles();
  const { user } = useAuth();
  const { sb, addChannelHandler, removeChannelHandler } = useChannel();
  const history = useHistory();
  const [ref, inView] = useInView();
  const params = useParams<{ id?: string }>();
  const [permissionHintOpen, setPermissionHintOpen] = useState(false);
  const [channelListQuery, setChannelListQuery] = useState<
    GroupChannelListQuery
  >();
  const channels = useRef<GroupChannel[]>([]);
  const currentChannelUrl = params.id;
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const filterChannels = useCallback(
    (chs: GroupChannel[]) =>
      chs.reduce<GroupChannel[]>((result, c) => {
        if (!user) {
          return result;
        }

        // Check if channel is system channel.
        if (c.url === user.systemChannelUrl) {
          result.push(c);
          return result;
        }

        const [applicantMember, recruiterMember] = parseChannel(c);
        // if (!applicantMember || !recruiterMember) {
        //   return result;
        // }

        if (c.customType === ChannelCustomType.Bottle && !isRecruiter) {
          result.push(c);
        } else if (isRecruiter) {
          recruiterMember &&
            user.uuid === recruiterMember.userId &&
            result.push(c);
        } else {
          applicantMember &&
            user.uuid === applicantMember.userId &&
            result.push(c);
        }

        return result;
      }, []),
    [isRecruiter, user]
  );

  const onChannelChanged: ChannelHandler["onChannelChanged"] = useCallback(
    (ch) => {
      if (!isGroupChannel(ch)) {
        return;
      }

      const index = channels.current.findIndex((c) => c.url === ch.url);
      if (index !== -1) {
        channels.current[index] = ch;
        forceUpdate();
      }
    },
    []
  );

  const onMessageReceived: ChannelHandler["onMessageReceived"] = useCallback(
    (ch) => {
      if (!isGroupChannel(ch)) {
        return;
      }
      if (filterChannels([ch]).length === 0) {
        return;
      }

      const newChannelList = channels.current.filter((c) => c.url !== ch.url);
      channels.current = [ch, ...newChannelList];
      forceUpdate();
    },
    [filterChannels]
  );

  useEffect(() => {
    if (inView && channelListQuery?.hasNext) {
      channelListQuery.next((channelList, error) => {
        if (error) {
          return;
        }

        channels.current.push(...filterChannels(channelList));
        forceUpdate();
      });
    }
  }, [channelListQuery, filterChannels, inView]);

  useEffect(() => {
    let handlerId: string | undefined;

    if (sb) {
      // Register onMessageReceived listener.
      const handler = new sb.ChannelHandler();
      handler.onMessageReceived = onMessageReceived;
      handler.onChannelChanged = onChannelChanged;
      handlerId = addChannelHandler(handler);
    }

    return () => {
      handlerId && removeChannelHandler(handlerId);
    };
  }, [
    addChannelHandler,
    onChannelChanged,
    onMessageReceived,
    removeChannelHandler,
    sb,
  ]);

  useEffect(() => {
    if (sb) {
      const query = sb.GroupChannel.createMyGroupChannelListQuery();
      query.includeEmpty = true;
      query.order = "latest_last_message";
      query.limit = 30;
      setChannelListQuery(query);
    }
  }, [sb]);

  const renderChannelList = () => (
    <div className={classes.channelListContainer}>
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <div style={{ overflow: "auto", flex: 1 }}>
          {Notification.permission === "default" && (
            <div
              className={classes.permissionButton}
              onClick={async () => {
                setPermissionHintOpen(true);
                await Notification.requestPermission();
                setPermissionHintOpen(false);
                forceUpdate();
              }}
            >
              有新訊息時立即得知
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 8 }}>
                開啟通知功能
              </div>
            </div>
          )}
          {channels.current.map((c) => {
            const myId = user?.uuid;
            const they: SendBird.Member | undefined = c.members.filter(
              (m) => m.userId !== myId
            )[0];

            return (
              <div
                key={c.url}
                onClick={() => {
                  if (isRecruiter) {
                    history.push(`/recruiter/message/${c.url}`);
                  } else {
                    history.push(`/message/${c.url}`);
                  }
                }}
              >
                <ChannelListCard
                  name={they ? they.nickname : "對方已離開對話框"}
                  profileImageUrl={they ? they.profileUrl : ""}
                  teamName={
                    isRecruiter ? "" : c.data ? JSON.parse(c.data).teamName : ""
                  }
                  selected={c.url === currentChannelUrl}
                  unreadMessageCount={c.unreadMessageCount}
                  lastMessage={c.lastMessage}
                  leaveChannel={() => {
                    c.leave(() => {
                      channels.current = channels.current.filter(
                        (ch) => ch.url !== c.url
                      );
                      forceUpdate();
                      history.push(
                        isRecruiter ? "/recruiter/message" : "/message"
                      );
                    });
                  }}
                />
              </div>
            );
          })}
          <div ref={ref}></div>
        </div>
      </div>
    </div>
  );

  const renderChat = () => (
    <div className={classes.chatContainer}>
      {currentChannelUrl && (
        <MessageBox
          channelUrl={currentChannelUrl}
          isRecruiter={!!isRecruiter}
        />
      )}
    </div>
  );

  return (
    <>
      <div className={classes.container}>
        {renderChannelList()}
        {renderChat()}
      </div>
      <Backdrop
        className={classes.backdrop}
        open={permissionHintOpen}
        onClick={() => setPermissionHintOpen(false)}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 24, fontWeight: 700, margin: 16 }}>
            點選左上角的允許通知，在第一時間收到訊息通知。
          </div>
          <div>
            <Button size="medium" variant="contained" color="primary">
              知道了
            </Button>
          </div>
        </div>
      </Backdrop>
    </>
  );
};

export { ChatRoom };
