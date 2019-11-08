import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import { makeStyles } from "@material-ui/core/styles";
import to from "await-to-js";
import firebase from "firebase/app";
import "firebase/auth";
import React from "react";
import { Link } from "react-router-dom";
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

const RecruiterProfileMenu: React.FC<Props> = props => {
  const { isOpen, anchorElement, close } = props;
  const classes = useStyles();
  const { user } = useAuth();

  return (
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
                {user && <MenuItem>{user.name}</MenuItem>}
                <Link to="/recruiter/team" className={classes.link}>
                  <MenuItem onClick={close}>公司簡介</MenuItem>
                </Link>
                {/* <MenuItem onClick={close}>公司成員</MenuItem> */}
                {user && user.recruiterInfo && user.recruiterInfo.isAdmin && (
                  <Link to="/recruiter/point" className={classes.link}>
                    <MenuItem onClick={close}>點數管理</MenuItem>
                  </Link>
                )}
                <MenuItem
                  onClick={async () => {
                    close();
                    await to(firebase.auth().signOut());
                  }}
                >
                  登出
                </MenuItem>
                {/* <MenuItem onClick={changeTheme}>深色模式</MenuItem> */}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};

export { RecruiterProfileMenu };
