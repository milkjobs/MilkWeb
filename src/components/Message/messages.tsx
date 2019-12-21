import React from "react";
import { Message } from "components/Message";
import { makeStyles } from "@material-ui/core/styles";
import { createStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    messages: {
      flexGrow: 1
    }
  })
);

interface Props {
  messages: Array<SendBird.UserMessage>;
  userId: string;
}

const Messages: React.FC<Props> = props => {
  const classes = useStyles();
  const { userId } = props;
  const messages = props.messages
    .slice()
    .reverse()
    .map((message, i) => {
      return (
        <Message
          key={i}
          profileUrl={message.sender.profileUrl}
          message={message}
          fromMe={message.sender.userId === userId}
        />
      );
    });

  return (
    <div className={classes.messages} id="messageList">
      {messages}
    </div>
  );
};

export { Messages };
