import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { useState } from "react";
import Popper from "@material-ui/core/Popper";
import Typography from "@material-ui/core/Typography";
import Fade from "@material-ui/core/Fade";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import { ClickAwayListener } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    message: {
      margin: 16,
      display: "flex",
      alignItems: "center",
    },
    messageBody: {
      textDecoration: "none",
      color: theme.palette.text.primary,
      width: "auto",
      display: "flex",
      alignItems: "center",
      marginLeft: 16,
      marginRight: 16,
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 8,
      paddingBottom: 8,
      fontSize: 14,
      backgroundColor: "#eee",
      border: 1,
      borderRadius: 5,
      textAlign: "left",
      overflowWrap: "anywhere",
      maxWidth: "60%",
      whiteSpace: "pre",
    },
    typography: {
      padding: theme.spacing(2),
      cursor: "pointer",
    },
  })
);

interface Props {
  profileUrl: string;
  message: SendBird.UserMessage;
  fromMe: boolean;
  channel?: SendBird.GroupChannel;
}

const TextMessage: React.FC<Props> = (props) => {
  const classes = useStyles();
  // Was the message sent by the current user. If so, add a css class
  const { fromMe, profileUrl, message, channel } = props;
  const [popperOpen, setPopperOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [text, setText] = useState(message.message);
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const updateMessage = () => {
    channel?.updateUserMessage(
      message.messageId,
      text,
      message.data,
      message.customType,
      (res, err) => {
        res && setEditOpen(false);
      }
    );
  };

  return !fromMe ? (
    <div className={classes.message}>
      <img alt="" src={profileUrl} width={40} height={40} />
      <div className={classes.messageBody}>{message.message}</div>
    </div>
  ) : (
    <div
      style={{
        justifyContent: "flex-end",
      }}
      className={classes.message}
    >
      <div
        className={classes.messageBody}
        style={{ textAlign: "right" }}
        onContextMenu={(e) => {
          setAnchorEl(e.currentTarget);
          setPopperOpen(true);
          e.preventDefault();
        }}
      >
        {text}
      </div>
      <Popper
        open={popperOpen}
        anchorEl={anchorEl}
        placement={"bottom"}
        transition
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={() => setPopperOpen(false)}>
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                <Typography
                  className={classes.typography}
                  onClick={() => setEditOpen(true)}
                >
                  編輯
                </Typography>
              </Paper>
            </Fade>
          </ClickAwayListener>
        )}
      </Popper>
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            type="email"
            value={text}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              e.target.value !== "" && setText(e.target.value)
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} color="primary">
            取消
          </Button>
          <Button onClick={updateMessage} color="primary">
            確定
          </Button>
        </DialogActions>
      </Dialog>
      <img alt="" src={profileUrl} width={40} height={40} />
    </div>
  );
};

export { TextMessage };
