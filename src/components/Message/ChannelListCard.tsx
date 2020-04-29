import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import moment from "moment";
import "moment/locale/zh-tw";
import React, { useState } from "react";
import Popper from "@material-ui/core/Popper";
import Typography from "@material-ui/core/Typography";
import Fade from "@material-ui/core/Fade";
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { ClickAwayListener, Button } from "@material-ui/core";
import { useChannel } from "stores";
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
    typography: {
      padding: theme.spacing(2),
      cursor: "pointer",
    },
  })
);

interface Props {
  name: string;
  profileImageUrl: string;
  teamName: string;
  selected: boolean;
  systemChannel?: boolean;
  unreadMessageCount: number;
  lastMessage:
    | SendBird.UserMessage
    | SendBird.FileMessage
    | SendBird.AdminMessage
    | null;
  leaveChannel: () => void;
}

const ChannelListCard: React.FC<Props> = (props) => {
  const classes = useStyles();
  const {
    name,
    profileImageUrl,
    teamName,
    selected,
    systemChannel,
    unreadMessageCount,
    lastMessage,
    leaveChannel,
  } = props;
  const { sb } = useChannel();
  const [popperOpen, setPopperOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  return (
    <div
      className={classes.container}
      style={{ backgroundColor: selected ? "#eeeeee" : "white" }}
      onContextMenu={(e) => {
        if (!systemChannel) {
          setAnchorEl(e.currentTarget);
          setPopperOpen(true);
          e.preventDefault();
        }
      }}
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
          {lastMessage &&
            ("message" in lastMessage ? lastMessage.message : lastMessage.name)}
        </div>
      </div>
      <Popper
        open={popperOpen}
        anchorEl={anchorEl}
        placement={"bottom-end"}
        transition
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={() => setPopperOpen(false)}>
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                <Typography
                  className={classes.typography}
                  onClick={() => setDialogOpen(true)}
                >
                  離開
                </Typography>
              </Paper>
            </Fade>
          </ClickAwayListener>
        )}
      </Popper>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle>{"確定要離開對話框？"}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            取消
          </Button>
          <Button
            onClick={() => {
              setDialogOpen(false);
              leaveChannel();
            }}
            color="primary"
          >
            確定
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export { ChannelListCard };
