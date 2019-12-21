import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { uuid4 } from "@sentry/utils";
import { Messages } from "components/Message";
import { AlertDialog } from "components/Util";
import { AlertType } from "helpers";
import React, { useEffect, useRef, useState } from "react";
import SendBird from "sendbird";
import { useAuth } from "stores";

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

const MessageBox: React.FC<Props> = props => {
  const classes = useStyles();
  const { channel, isRecruiter } = props;

  const { userId, user } = useAuth();

  const [input, setInput] = useState("");
  const useForceUpdate = () => {
    const [, setState] = useState();
    return () => setState({});
  };
  const forceUpdate = useForceUpdate();
  const messages = useRef<any>([]);
  const messagesEl = useRef<any>(null);
  const recruiter = channel.members.filter(m => m.userId !== userId)[0];

  const [scrollHeight, setScrollHeight] = useState(0);
  const [prevMessageListQuery, setPrevMessageListQuery] = useState<
    SendBird.PreviousMessageListQuery
  >();
  const [open, setOpen] = React.useState(false);

  const handleNoResumeHintOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const loadPreviousMessages = (
    messageQuery: SendBird.PreviousMessageListQuery
  ) => {
    return new Promise((resolve, reject) => {
      messageQuery.load((messages, error) => {
        error ? reject(error) : resolve(messages);
      });
    });
  };

  useEffect(() => {
    const getPreviousMessages = async () => {
      const prevMessageListQuery = channel.createPreviousMessageListQuery();
      prevMessageListQuery.limit = 20;
      prevMessageListQuery.reverse = true;
      setPrevMessageListQuery(prevMessageListQuery);
      const previousMesssages = await loadPreviousMessages(
        prevMessageListQuery
      );
      messages.current = previousMesssages;
      forceUpdate();
      // scroll to bottom
      setScrollHeight(messagesEl.current.scrollHeight);
      messagesEl.current.scrollTop =
        messagesEl.current.scrollHeight - messagesEl.current.offsetHeight;
      channel.markAsRead();
    };
    if (channel) {
      getPreviousMessages();
      const onMessageReceived = (c, m) => {
        if (channel.url === c.url) {
          c.markAsRead();
          messages.current = [m].concat(messages.current);
          forceUpdate();
        }
      };
      const sb = SendBird.getInstance();
      const handler = new sb.ChannelHandler();
      handler.onMessageReceived = onMessageReceived;
      const messageHandlerId = uuid4();
      sb.addChannelHandler(messageHandlerId, handler);
    }
  }, [channel]);

  const sendUserMessage = ({ channel, message }) => {
    return new Promise((resolve, reject) => {
      channel.sendUserMessage(message, (message, error) => {
        error ? reject(error) : resolve(message);
      });
    });
  };

  const keyPress = async e => {
    if (e.keyCode === 13) {
      const text = e.target.value.replace(/(\r\n|\n|\r)/gm, "");
      const message = await sendUserMessage({
        channel,
        message: text
      });
      messages.current = [message].concat(messages.current);
      setInput("");
      // scroll to bottom
      messagesEl.current.scrollTop =
        messagesEl.current.scrollHeight - messagesEl.current.offsetHeight;
    }
  };

  const handleScroll = async e => {
    if (prevMessageListQuery && channel && e.target.scrollTop === 0) {
      const fetchedMessages: any = await loadPreviousMessages(
        prevMessageListQuery
      );
      messages.current = messages.current.concat(fetchedMessages);
      forceUpdate();
      // keep scroll position
      messagesEl.current.scrollTop =
        messagesEl.current.scrollHeight - scrollHeight;
      setScrollHeight(messagesEl.current.scrollHeight);
    }
  };

  const sendResume = async () => {
    if (user && user.profile && user.profile.resumeKey) {
      const sb = SendBird.getInstance();
      const params = new sb.UserMessageParams();
      params.customType = "resume";
      params.data = JSON.stringify({ resumeKey: user.profile?.resumeKey });
      params.message = "履歷";
      const message = await sendUserMessage({
        channel,
        message: params
      });
      messages.current = [message].concat(messages.current);
      forceUpdate();
      // scroll to bottom
      messagesEl.current.scrollTop =
        messagesEl.current.scrollHeight - messagesEl.current.offsetHeight;
    } else handleNoResumeHintOpen();
  };

  return (
    <div className={classes.container}>
      <AlertDialog
        isOpen={open}
        close={handleClose}
        type={AlertType.NoResume}
      />
      <div className={classes.jobContainer}>
        <div className={classes.jobName}>{recruiter.nickname}</div>
      </div>
      <div
        className={classes.messages}
        onScroll={handleScroll}
        ref={el => {
          messagesEl.current = el;
        }}
      >
        <Messages messages={messages.current} userId={userId || ""} />
      </div>
      <div className={classes.messageInput}>
        {!isRecruiter && (
          <div style={{ display: "flex", marginLeft: 8, marginTop: 4 }}>
            <Button onClick={sendResume}>發送履歷</Button>
          </div>
        )}
        <Input
          value={input}
          id="standard-multiline-static"
          autoFocus
          multiline
          rows="4"
          onChange={e => setInput(e.target.value)}
          className={classes.textField}
          onKeyDown={keyPress}
          disableUnderline={true}
        />
      </div>
    </div>
  );
};

interface Props {
  channel: SendBird.GroupChannel;
  isRecruiter: boolean;
}

export { MessageBox };
