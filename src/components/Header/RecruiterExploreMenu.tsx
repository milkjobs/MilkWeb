import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import React from "react";
import { Link } from "react-router-dom";

interface Props {
  close: () => void;
  isOpen: boolean;
  anchorElement: null | HTMLElement;
}

const RecruiterExploreMenu: React.FC<Props> = (props) => {
  const { isOpen, anchorElement, close } = props;

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
                <Link
                  to="/recruiter/circle"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <MenuItem onClick={close}>工作圈</MenuItem>
                </Link>
                <Link
                  to="/recruiter/qna"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <MenuItem onClick={close}>職場問答</MenuItem>
                </Link>
                {/* <Link
                  to="/recruiter/recommend-candidates"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <MenuItem onClick={close}>人才推薦</MenuItem>
                </Link> */}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};

export { RecruiterExploreMenu };
