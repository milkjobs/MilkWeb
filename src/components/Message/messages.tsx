import React from "react";
import { Message } from "components/Message";
import { makeStyles } from "@material-ui/core/styles";
import { createStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    messages: {
      flexGrow: 1,
      padding: 20
    }
  })
);

interface Props {
  messages: Array<any>;
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
          username={message.username}
          message={message.message}
          fromMe={message._sender.userId === userId}
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
