import {
  makeStyles,
  useTheme,
  Avatar,
  TextField,
  Button
} from "@material-ui/core";
import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import { useAuth } from "stores";
import { PostReply } from "@frankyjuang/milkapi-client";
import EditIcon from "@material-ui/icons/Edit";
import { ParsedText } from "./";
import { Link } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

const useStyles = makeStyles(theme => ({
  postContainer: {
    margin: 8,
    borderRadius: 8,
    borderColor: theme.palette.divider,
    borderStyle: "solid",
    borderWidth: 1,
    display: "flex",
    alignItems: "start",
    flexDirection: "column",
    padding: 16,
    [theme.breakpoints.down("xs")]: {
      marginLeft: 16,
      marginRight: 16,
      borderRadius: 0,
      borderColor: theme.palette.divider,
      borderStyle: "solid",
      borderWidth: 0,
      borderBottomWidth: 1
    }
  },
  text: {
    textAlign: "left",
    fontSize: 16,
    lineHeight: 2,
    color: "black"
  },
  iconButton: {
    padding: 10
  },
  postIcons: {
    display: "flex",
    flexDirection: "row",
    marginLeft: "auto"
  },
  postIconButton: { padding: 0, marginLeft: 8 },
  postHeader: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 8,
    width: "100%",
    textDecoration: "none"
  },
  postAvatar: {
    width: 20,
    height: 20,
    marginRight: 8
  },
  name: {
    textDecoration: "none",
    color: theme.palette.text.primary
  }
}));

interface EditAnswerDialogProps {
  isOpen: boolean;
  close: () => void;
  answer: PostReply;
  updateAnswer: (answer: PostReply) => void;
  deleteAnswer: (answerId: string) => void;
}

const EditAnswerDialog: React.FC<EditAnswerDialogProps> = ({
  isOpen,
  close,
  answer,
  updateAnswer,
  deleteAnswer
}) => {
  const [text, setText] = useState(answer.text);

  return (
    <Dialog
      open={isOpen}
      onClose={close}
      aria-labelledby="form-dialog-title"
      fullWidth
    >
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          multiline
          rows={20}
          fullWidth
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            close();
            deleteAnswer(answer.uuid);
          }}
          color="secondary"
          style={{ marginRight: "auto" }}
        >
          刪除
        </Button>
        <Button onClick={close} color="primary">
          取消
        </Button>
        <Button
          onClick={() => {
            close();
            updateAnswer({ ...answer, text });
          }}
          color="primary"
        >
          更新
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface AnswerCardProps {
  answer: PostReply;
  updateAnswer: (answer: PostReply) => void;
  deleteAnswer: (answerId: string) => void;
}

const AnswerCard: React.FC<AnswerCardProps> = ({
  answer,
  updateAnswer,
  deleteAnswer
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const { user, getApi } = useAuth();
  const [editAnswerOpen, setEditAnswerOpen] = useState(false);

  return (
    <div className={classes.postContainer}>
      {answer.replier && (
        <div className={classes.postHeader}>
          <Link
            to={"/public-profile/" + answer.replier.uuid}
            style={{
              display: "flex",
              flexDirection: "row",
              textDecoration: "none"
            }}
          >
            <Avatar
              alt="profile image"
              className={classes.postAvatar}
              src={answer.replier.profileImageUrl}
            />
            <div className={classes.name}>{answer.replier.name}</div>
          </Link>
          <div className={classes.postIcons}>
            {user && user.uuid === answer.replier.uuid && (
              <>
                <IconButton
                  className={classes.postIconButton}
                  onClick={() => setEditAnswerOpen(true)}
                >
                  <EditIcon fontSize={"small"} />
                </IconButton>
              </>
            )}
          </div>
        </div>
      )}
      <ParsedText text={answer.text} showLine={5} />
      <EditAnswerDialog
        isOpen={editAnswerOpen}
        answer={answer}
        close={() => setEditAnswerOpen(false)}
        deleteAnswer={deleteAnswer}
        updateAnswer={updateAnswer}
      />
    </div>
  );
};

export { AnswerCard };
