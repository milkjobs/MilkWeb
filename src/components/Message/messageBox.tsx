import Button from "@material-ui/core/Button";
import Input, { InputProps } from "@material-ui/core/Input";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { AlertDialog } from "components/Util";
import { AlertType } from "helpers";
import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState
} from "react";
import { useInView } from "react-intersection-observer";
import {
  ChannelHandler,
  GroupChannel,
  Member,
  PreviousMessageListQuery,
  UserMessage
} from "sendbird";
import { useAuth, useChannel } from "stores";
import { MessageList } from "./MessageList";
import { isGroupChannel, isUserMessage, SendBirdMessage } from "./utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flex: 1,
      flexDirection: "column",
      borderTop: "1px solid #EBEBEB",
      borderRight: "1px solid #EBEBEB",
      borderBottom: "1px solid #EBEBEB",
      overflow: "hidden",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    },
    messages: {
      borderTop: "1px solid #EBEBEB",
      flex: 1,
      overflow: "auto"
    },
    messageInput: {
      padding: 8,
      borderTop: "1px solid #EBEBEB"
    },
    textField: {
      display: "flex",
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      flex: 1,
      border: 0
    },
    jobContainer: {
      display: "flex",
      marginLeft: 16,
      paddingTop: 8,
      paddingBottom: 8
    },
    jobName: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: 18,
      fontWeight: 800,
      color: "#484848",
      marginRight: 16
    },
    jobSalary: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: 18,
      fontWeight: 400,
      marginRight: 16,
      color: "#FD8150"
    },
    location: {
      display: "flex",
      fontSize: 16,
      fontWeight: 400,
      marginRight: 16,
      color: "#484848",
      justifyContent: "center",
      alignItems: "center"
    }
  })
);

interface Props {
  channelUrl: string;
  isRecruiter: boolean;
}

const MessageBox: React.FC<Props> = ({ channelUrl, isRecruiter }) => {
  const classes = useStyles();
  const { user } = useAuth();
  const { sb, addChannelHandler, removeChannelHandler } = useChannel();
  const [ref, inView] = useInView();
  const [input, setInput] = useState("");
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false);
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const [channel, setChannel] = useState<GroupChannel>();
  const [they, setThey] = useState<Member>();
  const [scrollHeight, setScrollHeight] = useState(0);
  const [prevMessageListQuery, setPrevMessageListQuery] = useState<
    PreviousMessageListQuery
  >();
  const messages = useRef<UserMessage[]>([]);
  const messagesEl = useRef<HTMLDivElement>(null);
  const theirLastSeenTime = useRef<number>();

  const loadPreviousMessages = (query: PreviousMessageListQuery) => {
    return new Promise<SendBirdMessage[]>((resolve, reject) => {
      query.load((msgs, error) => {
        error ? reject(error) : resolve(msgs);
      });
    });
  };

  const updateMetadata = ({
    channel,
    metadata
  }: {
    channel: GroupChannel;
    metadata: any;
  }) => {
    return new Promise<any>((resolve, reject) => {
      channel.updateMetaData(metadata, true, (res, err) => {
        err ? reject(err) : resolve(res);
      });
    });
  };

  const onKeyDown: InputProps["onKeyDown"] = async e => {
    if (channel && e.keyCode === 13) {
      const text = (e.target as HTMLInputElement).value.replace(
        /(\r\n|\n|\r)/gm,
        ""
      );
      const msg = await new Promise<SendBirdMessage>((resolve, reject) => {
        channel.sendUserMessage(text, (msg, error) => {
          error ? reject(error) : resolve(msg);
        });
      });
      isUserMessage(msg) && messages.current.unshift(msg);
      setInput("");
      if (messagesEl.current) {
        // scroll to bottom
        messagesEl.current.scrollTop =
          messagesEl.current.scrollHeight - messagesEl.current.offsetHeight;
      }
    }
  };

  useEffect(() => {
    const loadMoreMessages = async () => {
      if (
        inView &&
        prevMessageListQuery?.hasMore &&
        !prevMessageListQuery.isLoading
      ) {
        const fetchedMessages = await loadPreviousMessages(
          prevMessageListQuery
        );
        messages.current.push(...fetchedMessages.filter(isUserMessage));
        forceUpdate();

        if (messagesEl.current) {
          // keep scroll position
          messagesEl.current.scrollTop =
            messagesEl.current.scrollHeight - scrollHeight;
          setScrollHeight(messagesEl.current.scrollHeight);
        }
      }
    };

    loadMoreMessages();
  }, [inView, prevMessageListQuery, scrollHeight]);

  const sendResume = async () => {
    if (!sb || !channel) {
      return;
    }
    if (!user?.profile?.resumeKey) {
      setResumeDialogOpen(true);
      return;
    }

    const params = new sb.UserMessageParams();
    params.customType = "resume";
    params.data = JSON.stringify({ resumeKey: user.profile.resumeKey });
    params.message = "履歷";
    const msg = await new Promise<SendBirdMessage>((resolve, reject) => {
      channel.sendUserMessage(params, (msg, error) => {
        error ? reject(error) : resolve(msg);
      });
    });
    isUserMessage(msg) && messages.current.unshift(msg);
    forceUpdate();

    // Update resume meta data
    await updateMetadata({
      channel,
      metadata: {
        resumeKey: user.profile.resumeKey
      }
    });

    if (messagesEl.current) {
      // scroll to bottom
      messagesEl.current.scrollTop =
        messagesEl.current.scrollHeight - messagesEl.current.offsetHeight;
    }
  };

  const getTheirLastSeenTime = useCallback(
    (ch: GroupChannel) => {
      if (they && ch.url === channelUrl) {
        const readStatus = ch.getReadStatus();
        if (they.userId in readStatus && readStatus[they.userId]) {
          theirLastSeenTime.current = readStatus[they.userId].last_seen_at;
          forceUpdate();
        }
      }
    },
    [channelUrl, they]
  );

  const onMessageReceived: ChannelHandler["onMessageReceived"] = useCallback(
    (ch, msg) => {
      if (!isGroupChannel(ch)) {
        return;
      }

      if (channel && ch.url === channel.url) {
        ch.markAsRead();
        isUserMessage(msg) && messages.current.unshift(msg);
        forceUpdate();
        if (messagesEl.current) {
          // scroll to bottom
          messagesEl.current.scrollTop =
            messagesEl.current.scrollHeight - messagesEl.current.offsetHeight;
        }
      }
    },
    [channel]
  );

  useEffect(() => {
    let handlerId: string | undefined;

    if (sb) {
      // Register onChannelChanged listener.
      const handler = new sb.ChannelHandler();
      handler.onMessageReceived = onMessageReceived;
      handler.onReadReceiptUpdated = getTheirLastSeenTime;
      handlerId = addChannelHandler(handler);
    }

    return () => {
      handlerId && removeChannelHandler(handlerId);
    };
  }, [
    addChannelHandler,
    getTheirLastSeenTime,
    onMessageReceived,
    removeChannelHandler,
    sb
  ]);

  useEffect(() => {
    user &&
      channel &&
      setThey(channel.members.find(m => m.userId !== user.uuid));
  }, [channel, user]);

  useEffect(() => {
    const init = async () => {
      if (!sb) {
        return;
      }

      const ch = await new Promise<GroupChannel>((resolve, reject) => {
        sb.GroupChannel.getChannel(channelUrl, (ch, error) => {
          error ? reject(error) : resolve(ch);
        });
      });
      setChannel(ch);

      const query = ch.createPreviousMessageListQuery();
      query.limit = 20;
      query.reverse = true;
      setPrevMessageListQuery(query);
      const previousMessages = await loadPreviousMessages(query);
      messages.current = previousMessages.filter(isUserMessage);
      forceUpdate();

      getTheirLastSeenTime(ch);
      ch.markAsRead();

      if (messagesEl.current) {
        // scroll to bottom
        setScrollHeight(messagesEl.current.scrollHeight);
        messagesEl.current.scrollTop =
          messagesEl.current.scrollHeight - messagesEl.current.offsetHeight;
      }
    };

    init();
  }, [channelUrl, getTheirLastSeenTime, sb]);

  return (
    <div className={classes.container}>
      <AlertDialog
        isOpen={resumeDialogOpen}
        close={() => setResumeDialogOpen(false)}
        type={AlertType.NoResume}
      />
      <div className={classes.jobContainer}>
        <div className={classes.jobName}>{they?.nickname || ""}</div>
      </div>
      <div className={classes.messages} ref={messagesEl}>
        <div ref={ref}></div>
        <MessageList messages={messages.current} userId={user?.uuid || ""} />
      </div>
      <div className={classes.messageInput}>
        {!isRecruiter && (
          <div style={{ display: "flex", marginLeft: 8, marginTop: 4 }}>
            <Button onClick={sendResume}>發送履歷</Button>
          </div>
        )}
        <Input
          autoFocus
          className={classes.textField}
          disableUnderline={true}
          placeholder="Enter 鍵送出訊息"
          multiline
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          rows="4"
          value={input}
        />
      </div>
    </div>
  );
};

export { MessageBox };
