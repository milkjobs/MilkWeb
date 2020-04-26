import { Avatar, makeStyles, Badge } from "@material-ui/core";
import React, { MouseEvent, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth, useChannel } from "stores";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import { Apps } from "@material-ui/icons";

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
  const { openProfileMenu, openExploreMenu } = props;
  const classes = useStyles();
  const { user } = useAuth();
  const { unreadMessageCount } = useChannel();
  const location = useLocation();
  const isRecruiterHome = location.pathname === "/recruiter";
  const isRecruiterMessage = location.pathname.startsWith("/recruiter/message");

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
      <Link
        to="/recruiter/search"
        style={{
          textDecoration: "none",
          color: "#484848",
          display: "flex",
        }}
      >
        <span className={classes.tab}>人才搜尋</span>
      </Link>
      {!isRecruiterMessage && (
        <Link to="/recruiter/message" className={classes.link}>
          <span className={classes.tab}>
            <Badge
              color="secondary"
              variant="dot"
              invisible={(unreadMessageCount || 0) === 0}
            >
              訊息
            </Badge>
          </span>
        </Link>
      )}
      <span className={classes.tab} onClick={openExploreMenu}>
        <Apps />
      </span>
      {user && (
        <span className={classes.tab} onClick={openProfileMenu}>
          <Avatar
            alt="profile image"
            className={classes.avatar}
            src={user.profileImageUrl}
          />
        </span>
      )}
    </div>
  );
};

export { RecruiterHeaderTabs };
