import { createStyles, makeStyles } from "@material-ui/core/styles";
import React from "react";
import { Message } from ".";

const useStyles = makeStyles(() =>
  createStyles({
    messages: {
      flexGrow: 1
    }
  })
);

interface Props {
  messages: SendBird.UserMessage[];
  userId: string;
}

const MessageList: React.FC<Props> = ({ userId, messages }) => {
  const classes = useStyles();

  return (
    <div className={classes.messages}>
      {messages
        .slice()
        .reverse()
        .map(msg => (
          <Message
            key={msg.messageId}
            profileUrl={msg.sender.profileUrl}
            message={msg}
            fromMe={msg.sender.userId === userId}
          />
        ))}
    </div>
  );
};

export { MessageList };
