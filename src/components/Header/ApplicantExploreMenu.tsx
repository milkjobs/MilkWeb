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

const ApplicantExploreMenu: React.FC<Props> = props => {
  const { close, isOpen, anchorElement } = props;

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
                <Link
                  to="/explore"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <MenuItem onClick={close}>團隊列表</MenuItem>
                </Link>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};

export { ApplicantExploreMenu };
