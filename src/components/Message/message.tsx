import React from "react";
import { createStyles, Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";

const Message: React.FC<Props> = props => {
  // Was the message sent by the current user. If so, add a css class
  const classes = useStyles();
  const { fromMe } = props;

  return !fromMe ? (
    <div className={classes.message}>
      <img alt="" src={props.profileUrl} width={40} height={40} />
      <div className={classes.messageBody}>{props.message}</div>
    </div>
  ) : (
    <div
      style={{
        justifyContent: "flex-end"
      }}
      className={classes.message}
    >
      <div className={classes.messageBody}>{props.message}</div>
      <img alt="" src={props.profileUrl} width={40} height={40} />
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    message: {
      margin: 16,
      display: "flex"
    },
    messageBody: {
      width: "auto",
      display: "flex",
      alignItems: "center",
      marginLeft: 16,
      marginRight: 16,
      paddingLeft: 16,
      paddingRight: 16,
      fontSize: 14,
      backgroundColor: "#eee",
      border: 1,
      borderRadius: 5
    }
  })
);

interface Props {
  profileUrl: string;
  message: string;
  fromMe: boolean;
}

export { Message };
