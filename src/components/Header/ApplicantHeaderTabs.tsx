import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import { DownloadAppDialog, LoginDialog } from "components/Util";
import { TeamCreateForm } from "components/TeamComponents";
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
  const [isCreateTeamFormOpen, setIsCreateTeamFormOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const isHome = location.pathname === "/";

  const showCreateTeamForm = () => {
    setIsCreateTeamFormOpen(true);
  };

  const hideCreateTeamForm = () => {
    setIsCreateTeamFormOpen(false);
  };

  const showDownloadAppDialog = () => {
    setIsDownloadAppDialogOpen(true);
  };

  const hideDownloadAppDialog = () => {
    setIsDownloadAppDialogOpen(false);
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
      {isHome &&
        (user && !user.recruiterInfo ? (
          <div onClick={showCreateTeamForm} className={classes.link}>
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
      <Link to={"/message"} className={classes.link}>
        <span className={classes.tab}>訊息</span>
      </Link>

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
          <div onClick={showLoginDialog} className={classes.link}>
            <span className={classes.tab}>登入</span>
          </div>
        </>
      )}
      <DownloadAppDialog
        isOpen={isDownloadAppDialogOpen}
        close={hideDownloadAppDialog}
      />
      <LoginDialog isOpen={isLoginDialogOpen} close={hideLoginDialog} />
    </div>
  );
};

export { ApplicantHeaderTabs };
