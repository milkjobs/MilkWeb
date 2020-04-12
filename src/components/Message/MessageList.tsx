import { createStyles, makeStyles } from "@material-ui/core/styles";
import React from "react";
import { Message } from ".";

const useStyles = makeStyles((theme) =>
  createStyles({
    messages: {
      flexGrow: 1,
    },
    read: {
      marginLeft: "auto",
      marginRight: 16,
      marginBottom: 8,
      textAlign: "right",
      fontSize: 16,
      color: theme.palette.text.secondary,
    },
  })
);

interface Props {
  messages: (SendBird.UserMessage | SendBird.FileMessage)[];
  userId: string;
  theirLastSeenTime: React.MutableRefObject<number | undefined>;
  channel?: SendBird.GroupChannel;
}

const MessageList: React.FC<Props> = ({
  userId,
  messages,
  theirLastSeenTime,
  channel,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.messages}>
      {messages
        .slice()
        .reverse()
        .map((msg) => (
          <Message
            key={msg.messageId}
            profileUrl={msg.sender.profileUrl}
            message={msg}
            fromMe={msg.sender.userId === userId}
            channel={channel}
          />
        ))}
      {theirLastSeenTime.current !== undefined &&
        theirLastSeenTime.current >= messages[0].createdAt &&
        messages[0].sender.userId === userId && (
          <div className={classes.read}>{"已讀"}</div>
        )}
    </div>
  );
};

export { MessageList };
