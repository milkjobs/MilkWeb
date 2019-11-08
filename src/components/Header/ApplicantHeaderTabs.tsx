import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import { DownloadAppDialog, LoginDialog, SignUpDialog } from "components/Util";
import React, { MouseEvent, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "stores";

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
  const { openProfileMenu } = props;
  const classes = useStyles();
  const location = useLocation();
  const { user } = useAuth();
  const [isDownloadAppDialogOpen, setIsDownloadAppDialogOpen] = useState(false);
  const [isSignUpDialogOpen, setIsSignUpDialogOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const isHome = location.pathname === "/";

  const showDownloadAppDialog = () => {
    setIsDownloadAppDialogOpen(true);
  };

  const hideDownloadAppDialog = () => {
    setIsDownloadAppDialogOpen(false);
  };

  const showSignUpDialog = () => {
    setIsSignUpDialogOpen(true);
  };

  const hideSignUpDialog = () => {
    setIsSignUpDialogOpen(false);
  };

  const showLoginDialog = () => {
    setIsLoginDialogOpen(true);
  };

  const hideLoginDialog = () => {
    setIsLoginDialogOpen(false);
  };

  return (
    <div className={classes.sectionDesktop}>
      {isHome &&
        (user && !user.recruiterInfo ? (
          <div onClick={showDownloadAppDialog} className={classes.link}>
            <span className={classes.tab}>發佈職缺</span>
          </div>
        ) : (
          <Link to={"/recruiter"} className={classes.link}>
            <span className={classes.tab}>發佈職缺</span>
          </Link>
        ))}

      {isHome && (
        <Link to={"/help"} className={classes.link}>
          <span className={classes.tab}>幫助中心</span>
        </Link>
      )}

      {user ? (
        <span
          className={classes.tab}
          aria-owns={"material-appbar"}
          aria-haspopup="true"
          onClick={openProfileMenu}
        >
          <Avatar className={classes.avatar} src={user.profileImageUrl} />
        </span>
      ) : (
        <>
          <div onClick={showSignUpDialog} className={classes.link}>
            <span className={classes.tab}>註冊</span>
          </div>
          <div onClick={showLoginDialog} className={classes.link}>
            <span className={classes.tab}>登入</span>
          </div>
        </>
      )}
      <DownloadAppDialog
        isOpen={isDownloadAppDialogOpen}
        close={hideDownloadAppDialog}
      />
      <SignUpDialog isOpen={isSignUpDialogOpen} close={hideSignUpDialog} />
      <LoginDialog isOpen={isLoginDialogOpen} close={hideLoginDialog} />
    </div>
  );
};

export { ApplicantHeaderTabs };
