import { useMediaQuery } from "@material-ui/core";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import to from "await-to-js";
import { DownloadAppDialog, LoginDialog } from "components/Util";
import firebase from "firebase/app";
import "firebase/auth";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "stores";

const useStyles = makeStyles(theme => ({
  link: {
    textDecoration: "none",
    color: theme.palette.text.primary
  }
}));

interface Props {
  close: () => void;
  isOpen: boolean;
  anchorElement: null | HTMLElement;
}

const ApplicantProfileMenu: React.FC<Props> = props => {
  const { isOpen, anchorElement, close } = props;
  const classes = useStyles();
  const { user } = useAuth();
  const location = useLocation();
  const [isDownloadAppDialogOpen, setIsDownloadAppDialogOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isHome = location.pathname === "/";

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
    <>
      <Popper open={isOpen} anchorEl={anchorElement} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom"
            }}
          >
            <Paper square={true}>
              <ClickAwayListener onClickAway={close}>
                <MenuList>
                  {user && (
                    <Link to="/profile" className={classes.link}>
                      <MenuItem onClick={close}>{user.name}</MenuItem>
                    </Link>
                  )}

                  {isMobile &&
                    isHome &&
                    (user && !user.recruiterInfo ? (
                      <MenuItem
                        onClick={() => {
                          close();
                          showDownloadAppDialog();
                        }}
                      >
                        發佈職缺
                      </MenuItem>
                    ) : (
                      <Link to={"/recruiter"} className={classes.link}>
                        <MenuItem onClick={close}>發佈職缺</MenuItem>
                      </Link>
                    ))}

                  {isMobile && isHome && (
                    <Link to={"/help"} className={classes.link}>
                      <MenuItem onClick={close}>幫助中心</MenuItem>
                    </Link>
                  )}
                  {/* {user && (
                    <Link to="/favorite" className={classes.link}>
                      <MenuItem onClick={close}>工作收藏</MenuItem>
                    </Link>
                  )} */}
                  {user && (
                    <Link to="/resume" className={classes.link}>
                      <MenuItem onClick={close}>履歷</MenuItem>
                    </Link>
                  )}
                  {user ? (
                    <MenuItem
                      onClick={async () => {
                        close();
                        window.localStorage.removeItem("sendbirdCredential");
                        await to(firebase.auth().signOut());
                        window.localStorage.removeItem("sendbirdCredential");
                      }}
                    >
                      登出
                    </MenuItem>
                  ) : (
                    <MenuItem
                      onClick={() => {
                        close();
                        showLoginDialog();
                      }}
                    >
                      登入
                    </MenuItem>
                  )}
                  {/* <MenuItem onClick={changeTheme}>深色模式</MenuItem> */}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      <DownloadAppDialog
        isOpen={isDownloadAppDialogOpen}
        close={hideDownloadAppDialog}
      />
      <LoginDialog isOpen={isLoginDialogOpen} close={hideLoginDialog} />
    </>
  );
};

export { ApplicantProfileMenu };
