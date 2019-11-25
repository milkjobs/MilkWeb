import React from "react";
import { createStyles, Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import SendBird from "sendbird";
import moment from "moment";
import "moment/locale/zh-tw";
moment.locale();

interface Props {
  recruiter: SendBird.Member;
  teamName: string;
  selected: boolean;
  unreadMessageCount: number;
  lastMessage: any;
}

const MessageCard: React.FC<Props> = props => {
  const classes = useStyles();
  const {
    recruiter,
    teamName,
    selected,
    unreadMessageCount,
    lastMessage
  } = props;
  return (
    <div
      className={classes.container}
      style={{ backgroundColor: selected ? "#eeeeee" : "white" }}
    >
      <Avatar src={recruiter.profileUrl} style={{ width: 40, height: 40 }} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          marginLeft: 8,
          justifyContent: "space-around"
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "row",
            marginBottom: 4,
            alignItems: "center"
          }}
        >
          <div className={classes.name}>
            {recruiter.nickname + (teamName ? `@${teamName}` : "")}
          </div>
          {unreadMessageCount !== 0 && (
            <div className={classes.notification}>{unreadMessageCount}</div>
          )}
          <div className={classes.date}>
            {lastMessage
              ? moment(new Date(lastMessage.createdAt)).calendar()
              : ""}
          </div>
        </div>
        <div className={classes.recentMessage}>
          {lastMessage ? lastMessage.message : ""}
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: 16,
      paddingBottom: 16,
      paddingLeft: 24,
      paddingRight: 24,
      display: "flex",
      flexDirection: "row",
      borderBottom: "1px solid #EBEBEB"
    },
    name: {
      marginRight: "auto",
      fontSize: 16,
      color: theme.palette.text.primary
    },
    notification: {
      display: "flex",
      marginRight: "auto",
      alignItems: "center",
      justifyContent: "center",
      marginTop: "auto",
      marginBottom: "auto",
      backgroundColor: theme.palette.secondary.main,
      borderRadius: "50%",
      width: 14,
      padding: 2,
      height: 14,
      fontSize: 16,
      color: theme.palette.secondary.contrastText
    },
    date: {
      fontSize: 12,
      marginLeft: "auto",
      color: theme.palette.text.hint
    },
    recentMessage: {
      marginRight: "auto",
      fontSize: 12,
      justifyContent: "center",
      alignItems: "center",
      color: theme.palette.text.primary
    }
  })
);

export { MessageCard };
