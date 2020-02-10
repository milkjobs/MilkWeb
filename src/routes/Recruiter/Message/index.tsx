import { makeStyles } from "@material-ui/core/styles";
import { Header } from "components/Header";
import { ChatRoom } from "components/Message";
import React from "react";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    backgroundColor: theme.palette.background.paper
  }
}));

const Message: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Header />
      <ChatRoom isRecruiter />
    </div>
  );
};

export default Message;
