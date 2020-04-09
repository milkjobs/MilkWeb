import { Avatar, makeStyles, Badge } from "@material-ui/core";
import React, { MouseEvent, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth, useChannel } from "stores";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: "none",
    color: "#484848",
    display: "flex",
  },
  tab: {
    marginLeft: 30,
    display: "flex",
    height: "auto",
    alignItems: "center",
    color: "#484848",
    justifyContent: "center",
    cursor: "pointer",
    "&:hover": {
      color: theme.palette.secondary.main,
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "flex",
      alignSelf: "stretch",
    },
  },
  avatar: {
    width: 30,
    height: 30,
    boxShadow: "0 4px 4px rgba(0,0,0,0.1) !important",
  },
}));

interface Props {
  openExploreMenu: (event: MouseEvent<HTMLElement>) => void;
  openProfileMenu: (event: MouseEvent<HTMLElement>) => void;
}
const RecruiterHeaderTabs: React.FC<Props> = (props) => {
  const { openProfileMenu } = props;
  const classes = useStyles();
  const { user } = useAuth();
  const { unreadMessageCount } = useChannel();
  const location = useLocation();
  const isRecruiterHome = location.pathname === "/recruiter";
  const isRecruiterMessage = location.pathname.startsWith("/recruiter/message");
  const [messageAlert, setMessageAlert] = useState(false);

  return (
    <div className={classes.sectionDesktop}>
      <Link to="/" className={classes.link}>
        <span className={classes.tab}>瀏覽工作</span>
      </Link>
      {!isRecruiterHome && (
        <Link
          to="/recruiter"
          style={{
            textDecoration: "none",
            color: "#484848",
            display: "flex",
          }}
        >
          <span className={classes.tab}>職缺管理</span>
        </Link>
      )}
      {!isRecruiterMessage && (
        <div className={classes.link} onClick={() => setMessageAlert(true)}>
          {/* <Link to="/recruiter/message" className={classes.link}> */}
          <span className={classes.tab}>
            <Badge
              color="secondary"
              variant="dot"
              invisible={(unreadMessageCount || 0) === 0}
            >
              訊息
            </Badge>
          </span>
          {/* </Link> */}
        </div>
      )}
      <Link
        to="/recruiter/circle"
        style={{
          textDecoration: "none",
          color: "#484848",
          display: "flex",
        }}
      >
        <span className={classes.tab}>工作圈</span>
      </Link>
      {user && (
        <span className={classes.tab} onClick={openProfileMenu}>
          <Avatar
            alt="profile image"
            className={classes.avatar}
            src={user.profileImageUrl}
          />
        </span>
      )}
      <Dialog
        onClose={() => setMessageAlert(false)}
        aria-labelledby="simple-dialog-title"
        open={messageAlert}
      >
        <DialogContent
          id="simple-dialog-title"
          style={{ padding: 24, fontSize: 20 }}
        >
          感謝你使用牛奶找工作，基於保護求職者的原則，正在配合勞動局申請相關證照。在這之前【訊息】功能將暫時關閉。
          <br />
          為了讓求職者在這段期間可以順利聯絡你，公司可以在職缺敘述中留下聯絡方式。
          <br />
          預計四月初將會恢復正常，屆時也會開放【人才搜尋】的功能，敬請期待。
          <br />
          造成困擾，我們非常抱歉。
          <br />
          有任何問題，可以撥打 02-29888528 。
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { RecruiterHeaderTabs };
