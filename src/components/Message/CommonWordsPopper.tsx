import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { useState } from "react";
import Popper from "@material-ui/core/Popper";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { Button, ClickAwayListener } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    typography: {
      padding: theme.spacing(2),
    },
  })
);

const CommonWordsPopper: React.FC = () => {
  // Was the message sent by the current user. If so, add a css class
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  return (
    <>
      <Button onClick={handleClick}>常用語</Button>
      <Popper open={open} anchorEl={anchorEl} placement={"top"} transition>
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Paper>
            <Typography className={classes.typography}>
              The content of the Popper.
            </Typography>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  );
};

export { CommonWordsPopper };
