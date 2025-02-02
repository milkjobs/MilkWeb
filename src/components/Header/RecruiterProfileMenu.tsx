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
import { VerificationState } from "@frankyjuang/milkapi-client";

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
}));

interface Props {
  close: () => void;
  isOpen: boolean;
  anchorElement: null | HTMLElement;
}

const RecruiterProfileMenu: React.FC<Props> = (props) => {
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
              placement === "bottom" ? "center top" : "center bottom",
          }}
        >
          <Paper square={true}>
            <ClickAwayListener onClickAway={close}>
              <MenuList>
                {user && (
                  <Link to="/recruiter/profile" className={classes.link}>
                    <MenuItem onClick={close}>{user.name}</MenuItem>
                  </Link>
                )}
                {user &&
                  user.recruiterInfo &&
                  user.recruiterInfo.team &&
                  user.recruiterInfo.team.certificateVerified !==
                    VerificationState.Passed && (
                    <Link to="/recruiter/verification" className={classes.link}>
                      <MenuItem onClick={close}>公司驗證</MenuItem>
                    </Link>
                  )}
                <Link to="/recruiter/team" className={classes.link}>
                  <MenuItem onClick={close}>公司簡介</MenuItem>
                </Link>
                <Link to="/recruiter/member" className={classes.link}>
                  <MenuItem onClick={close}>公司成員</MenuItem>
                </Link>
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
