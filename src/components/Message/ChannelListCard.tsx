import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import moment from "moment";
import "moment/locale/zh-tw";
import React from "react";
moment.locale("zh-tw");

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: 16,
      paddingBottom: 16,
      paddingLeft: 24,
      paddingRight: 24,
      display: "flex",
      flexDirection: "row",
      borderBottom: "1px solid #EBEBEB",
    },
    name: {
      marginRight: "auto",
      fontSize: 16,
      color: theme.palette.text.primary,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    badge: {
      marginRight: theme.spacing(1),
      display: "flex",
      alignItems: "center",
    },
    date: {
      fontSize: 12,
      marginLeft: "auto",
      color: theme.palette.text.hint,
    },
    recentMessage: {
      fontSize: 12,
      textAlign: "left",
      color: theme.palette.text.primary,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  })
);

interface Props {
  name: string;
  profileImageUrl: string;
  teamName: string;
  selected: boolean;
  unreadMessageCount: number;
  lastMessage:
    | SendBird.UserMessage
    | SendBird.FileMessage
    | SendBird.AdminMessage;
}

const ChannelListCard: React.FC<Props> = (props) => {
  const classes = useStyles();
  const {
    name,
    profileImageUrl,
    teamName,
    selected,
    unreadMessageCount,
    lastMessage,
  } = props;
  return (
    <div
      className={classes.container}
      style={{ backgroundColor: selected ? "#eeeeee" : "white" }}
    >
      <Badge
        className={classes.badge}
        badgeContent={unreadMessageCount}
        color="secondary"
      >
        <Avatar
          alt="profile image"
          src={profileImageUrl}
          style={{ width: 40, height: 40 }}
        />
      </Badge>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          marginLeft: 8,
          justifyContent: "space-around",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "row",
            marginBottom: 4,
            alignItems: "center",
          }}
        >
          <div className={classes.name}>
            {name + (teamName ? `@${teamName}` : "")}
          </div>
          <div className={classes.date}>
            {lastMessage
              ? moment(new Date(lastMessage.createdAt)).calendar()
              : ""}
          </div>
        </div>
        <div className={classes.recentMessage}>
          {"message" in lastMessage ? lastMessage.message : lastMessage.name}
        </div>
      </div>
    </div>
  );
};

export { ChannelListCard };
