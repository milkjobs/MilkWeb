import { makeStyles } from "@material-ui/core/styles";
import { ChannelListCard, MessageBox } from "components/Message";
import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState
} from "react";
import { useInView } from "react-intersection-observer";
import { useHistory, useParams } from "react-router-dom";
import { ChannelHandler, GroupChannel, GroupChannelListQuery } from "sendbird";
import { useAuth, useChannel } from "stores";
import { isGroupChannel } from "./utils";

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    flex: 1,
    flexDirection: "row"
  },
  channelListContainer: {
    position: "relative",
    border: "1px solid #EBEBEB",
    flex: 1,
    minWidth: 320,
    maxWidth: 420,
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  },
  chatContainer: {
    display: "flex",
    flex: 3,
    position: "relative"
  }
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
  const [channelListQuery, setChannelListQuery] = useState<
    GroupChannelListQuery
  >();
  const channels = useRef<GroupChannel[]>([]);
  const currentChannelUrl = params.id;
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const onChannelChanged: ChannelHandler["onChannelChanged"] = useCallback(
    channel => {
      console.log("onchannelchanged", channel);
      if (!isGroupChannel(channel)) {
        return;
      }
      const newChannelList = channels.current.filter(
        c => c.url !== channel.url
      );
      channels.current = [channel, ...newChannelList];
      forceUpdate();
    },
    []
  );

  const parseChannel = (channel: GroupChannel) => {
    const memberIds = channel.name.split("_");
    if (channel.members.length !== 2 || memberIds.length !== 2) {
      return [undefined, undefined];
    }

    const applicantUser = channel.members.find(m => m.userId === memberIds[0]);
    const recruiterUser = channel.members.find(m => m.userId === memberIds[1]);
    return [applicantUser, recruiterUser];
  };

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
        if (!applicantMember || !recruiterMember) {
          return result;
        }

        if (isRecruiter) {
          user.uuid === recruiterMember.userId && result.push(c);
        } else {
          user.uuid === applicantMember.userId && result.push(c);
        }

        return result;
      }, []),
    [isRecruiter, user]
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
      // Register onChannelChanged listener.
      const handler = new sb.ChannelHandler();
      handler.onChannelChanged = onChannelChanged;
      handlerId = addChannelHandler(handler);
    }

    return () => {
      handlerId && removeChannelHandler(handlerId);
    };
  }, [addChannelHandler, onChannelChanged, removeChannelHandler, sb]);

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
          bottom: 0
        }}
      >
        <div style={{ overflow: "auto" }}>
          {channels.current.map(c => {
            const myId = user?.uuid;
            const they = c.members.filter(m => m.userId !== myId)[0];

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
                  name={they.nickname}
                  profileImageUrl={they.profileUrl}
                  teamName={
                    isRecruiter ? "" : user?.recruiterInfo?.team?.nickname || ""
                  }
                  selected={c.url === currentChannelUrl}
                  unreadMessageCount={c.unreadMessageCount}
                  lastMessage={c.lastMessage}
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
    <div className={classes.container}>
      {renderChannelList()}
      {renderChat()}
    </div>
  );
};

export { ChatRoom };
