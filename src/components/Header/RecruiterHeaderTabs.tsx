import { Avatar, makeStyles, Badge } from "@material-ui/core";
import React, { MouseEvent, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth, useChannel } from "stores";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";

const useStyles = makeStyles(theme => ({
  link: {
    textDecoration: "none",
    color: "#484848",
    display: "flex"
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
      color: theme.palette.secondary.main
    }
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "flex",
      alignSelf: "stretch"
    }
  },
  avatar: {
    width: 30,
    height: 30,
    boxShadow: "0 4px 4px rgba(0,0,0,0.1) !important"
  }
}));

interface Props {
  openExploreMenu: (event: MouseEvent<HTMLElement>) => void;
  openProfileMenu: (event: MouseEvent<HTMLElement>) => void;
}
const RecruiterHeaderTabs: React.FC<Props> = props => {
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
            display: "flex"
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
          感謝大家使用我們的創業的產品，由於我們是新創公司，勞動局希望我們還是要申請相關的證照，才能開放讓求職者跟企業在平台上聯絡。
          <br></br>
          目前牛奶找工作【訊息】的功能將暫時關閉，若公司可以在職缺敘述中改留下
          email 或其他聯絡方式，讓求職者可以順利求職。<br></br> 我們的證照將在 4
          月初下來，屆時訊息功能將會加回來，也會一並開放人才搜尋的功能，敬請期待。造成困擾，本公司非常不好意思。
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { RecruiterHeaderTabs };
