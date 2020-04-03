import { Avatar, makeStyles, Badge } from "@material-ui/core";
import { Apps } from "@material-ui/icons";
import { TeamCreateForm } from "components/TeamComponents";
import { LoginDialog } from "components/Util";
import React, { MouseEvent, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth, useChannel } from "stores";

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
    color: theme.palette.text.primary,
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

const ApplicantHeaderTabs: React.FC<Props> = props => {
  const { openProfileMenu, openExploreMenu } = props;
  const classes = useStyles();
  const location = useLocation();
  const { user } = useAuth();
  const { unreadMessageCount } = useChannel();
  const [isCreateTeamFormOpen, setIsCreateTeamFormOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const isHome = location.pathname === "/";
  const isAbout = location.pathname === "/about";
  const isCircle = location.pathname.startsWith("/circle");
  const isMessage = location.pathname.startsWith("/message");

  const showCreateTeamForm = () => {
    setIsCreateTeamFormOpen(true);
  };

  const hideCreateTeamForm = () => {
    setIsCreateTeamFormOpen(false);
  };

  const showLoginDialog = () => {
    setIsLoginDialogOpen(true);
  };

  const hideLoginDialog = () => {
    setIsLoginDialogOpen(false);
  };

  return (
    <div className={classes.sectionDesktop}>
      <TeamCreateForm
        handleClose={hideCreateTeamForm}
        open={isCreateTeamFormOpen}
      />
      {(isHome || isAbout || isCircle) &&
        (user && !user.recruiterInfo ? (
          <div onClick={showCreateTeamForm} className={classes.link}>
            <span className={classes.tab}>刊登職缺</span>
          </div>
        ) : (
          <Link to="/recruiter" className={classes.link}>
            <span className={classes.tab}>刊登職缺</span>
          </Link>
        ))}

      {isHome && (
        <Link to="/help" className={classes.link}>
          <span className={classes.tab}>幫助中心</span>
        </Link>
      )}
      {!isMessage && (
        <Link to="/message" className={classes.link}>
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

      {user ? (
        <span className={classes.tab} onClick={openProfileMenu}>
          <Avatar
            alt="profile image"
            className={classes.avatar}
            src={user.profileImageUrl}
          />
        </span>
      ) : (
        <div onClick={showLoginDialog} className={classes.link}>
          <span className={classes.tab}>登入</span>
        </div>
      )}
      <LoginDialog isOpen={isLoginDialogOpen} close={hideLoginDialog} />
    </div>
  );
};

export { ApplicantHeaderTabs };
