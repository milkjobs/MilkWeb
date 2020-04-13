import { makeStyles, Button, TextField } from "@material-ui/core";
import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "stores";
import { Post, NewPost } from "@frankyjuang/milkapi-client";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { LoginDialog } from "components/Util";

const useStyles = makeStyles(theme => ({
  input: {
    marginLeft: 8,
    flex: 1
  },
  textArea: {
    borderWidth: 0,
    width: "100%",
    fontSize: 16,
    resize: "none",
    "&:focus": {
      outline: "none !important"
    }
  },
  textAreaError: {
    color: theme.palette.secondary.main
  },
  imagePlus: {
    color: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 24,
    backgroundColor: theme.palette.divider,
    minWidth: 100,
    height: 100,
    marginRight: 8,
    borderRadius: 8
  },
  postImage: {
    width: 100,
    height: 100,
    objectFit: "cover",
    marginRight: 8,
    borderRadius: 8
  },
  imageContainer: {
    position: "relative"
  },
  deleteIcon: {
    position: "absolute",
    padding: 0,
    top: 0,
    right: 8
  },
  imagesContainer: {
    width: "100%",
    display: "flex",
    overflow: "scroll",
    flexWrap: "nowrap"
  }
}));

interface QuestionDialogProps {
  open: boolean;
  question?: Post;
  onClose: () => void;
  finish: (post: NewPost | Post) => void;
  delete?: (postId: string) => void;
  theme?: string;
}

const QuestionDialog: React.FC<QuestionDialogProps> = ({
  open,
  onClose,
  finish,
  delete: deletePost,
  theme,
  question
}) => {
  const classes = useStyles();
  const { user } = useAuth();
  const [text, setText] = useState<string>(question ? question.text : "");
  const [textErrorMessage, setTextErrorMessage] = useState<string>();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  useEffect(() => {
    question && setText(question.text);
  }, [open]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > 2000) setTextErrorMessage("最多只能 2000 字");
    else {
      setTextErrorMessage("");
      setText(e.target.value);
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <DialogTitle id="form-dialog-title">
          {question ? "編輯提問" : "提問"}
        </DialogTitle>
        <DialogContent>
          <TextField
            className={classes.textArea}
            autoFocus
            id="standard-multiline-static"
            placeholder={"想問什麼？"}
            value={text}
            onChange={handleTextChange}
          />
          <div className={classes.textAreaError}>{textErrorMessage}</div>
        </DialogContent>
        <DialogActions>
          {question && deletePost && (
            <Button
              onClick={() => {
                deletePost(question.uuid);
                onClose();
              }}
              color="secondary"
              style={{ marginRight: "auto" }}
            >
              {"刪除"}
            </Button>
          )}
          {user ? (
            <Button
              onClick={() => {
                onClose();
                !question && setText("");
                text &&
                  finish(
                    question
                      ? { ...question, text }
                      : { text: text + "\n\n#提問" + theme || "" }
                  );
              }}
              color="primary"
              disabled={!text}
            >
              {question ? "更新" : "發布"}
            </Button>
          ) : (
            <>
              <Button onClick={() => setLoginDialogOpen(true)} color="primary">
                {"登入"}
              </Button>
              <LoginDialog
                isOpen={loginDialogOpen}
                close={() => setLoginDialogOpen(false)}
              />
            </>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export { QuestionDialog };
