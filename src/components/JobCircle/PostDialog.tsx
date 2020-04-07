import { makeStyles, Button } from "@material-ui/core";
import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "stores";
import { Post, NewPost } from "@frankyjuang/milkapi-client";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { LoginDialog } from "components/Util";
import ClearIcon from "@material-ui/icons/Clear";
import IconButton from "@material-ui/core/IconButton";
import { ImageMimeType } from "helpers";
import { Slide, toast, ToastContainer, ToastPosition } from "react-toastify";
import to from "await-to-js";

const useStyles = makeStyles((theme) => ({
  input: {
    marginLeft: 8,
    flex: 1,
  },
  textArea: {
    borderWidth: 0,
    width: "100%",
    fontSize: 16,
    resize: "none",
    "&:focus": {
      outline: "none !important",
    },
  },
  textAreaError: {
    color: theme.palette.secondary.main,
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
    borderRadius: 8,
  },
  postImage: {
    width: 100,
    height: 100,
    objectFit: "cover",
    marginRight: 8,
    borderRadius: 8,
  },
  imageContainer: {
    position: "relative",
  },
  deleteIcon: {
    position: "absolute",
    padding: 0,
    top: 0,
    right: 8,
  },
  imagesContainer: {
    width: "100%",
    display: "flex",
    overflow: "scroll",
    flexWrap: "nowrap",
  },
}));

interface PostDialogProps {
  open: boolean;
  post?: Post;
  onClose: () => void;
  finish: (post: NewPost | Post) => void;
  delete?: (postId: string) => void;
  theme?: string;
}

const PostDialog: React.FC<PostDialogProps> = ({
  open,
  onClose,
  finish,
  delete: deletePost,
  theme,
  post,
}) => {
  const classes = useStyles();
  const { user, getApi } = useAuth();
  const [text, setText] = useState<string>(
    post ? post.text : theme ? "\n\n" + theme : ""
  );
  const [imageUrls, setImageUrls] = useState<string[]>(
    post && post.imageUrls ? post.imageUrls : []
  );
  const [textErrorMessage, setTextErrorMessage] = useState<string>();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  useEffect(() => {
    setText(post ? post.text : theme ? "\n\n" + theme : "");
    setImageUrls(post && post.imageUrls ? post.imageUrls : []);
  }, [open]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > 2000) setTextErrorMessage("最多只能 2000 字");
    else {
      setTextErrorMessage("");
      setText(e.target.value);
    }
  };

  const uploadPostImage = useCallback(
    async (files: File[] | FileList) => {
      console.warn("Hello");
      if (files.length === 0) {
        return;
      }
      if (!user) {
        setLoginDialogOpen(true);
        return;
      }

      const file = files[0];
      if (file.size > 1 * 1024 * 1024) {
        toast.error("檔案過大，大小上限為 1MB");
        return;
      }

      const postApi = await getApi("Post");
      const [err, url] = await to(
        postApi.uploadPostImage({
          file,
          filename: file.name,
        })
      );
      if (err) {
        toast.error("上傳失敗，請稍後再試");
        return;
      }
      url && setImageUrls([...imageUrls, url]);
    },
    [getApi]
  );

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <DialogTitle id="form-dialog-title">
          {post ? "編輯貼文" : "建立貼文"}
        </DialogTitle>
        <DialogContent>
          <TextareaAutosize
            className={classes.textArea}
            autoFocus
            id="standard-multiline-static"
            placeholder={"在想什麼？"}
            rowsMin="4"
            rowsMax="40"
            value={text}
            onChange={handleTextChange}
          />
          <div className={classes.textAreaError}>{textErrorMessage}</div>
          <div className={classes.imagesContainer}>
            {imageUrls.map((i) => (
              <div key={i} className={classes.imageContainer}>
                <img src={i} alt="照片" className={classes.postImage}></img>
                <IconButton
                  className={classes.deleteIcon}
                  onClick={() => {
                    setImageUrls(imageUrls.filter((url) => url !== i));
                  }}
                >
                  <ClearIcon color={"primary"} />
                </IconButton>
              </div>
            ))}
            {user ? (
              <label>
                <input
                  hidden
                  accept={ImageMimeType}
                  onChange={(e) => {
                    e.target.files && uploadPostImage(e.target.files);
                  }}
                  type="file"
                />
                <div className={classes.imagePlus}>{"+"}</div>
              </label>
            ) : (
              <div
                className={classes.imagePlus}
                onClick={() => setLoginDialogOpen(true)}
              >
                {"+"}
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          {post && deletePost && (
            <Button
              onClick={() => {
                deletePost(post.uuid);
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
                !post && setText("");
                text &&
                  finish(
                    post ? { ...post, text, imageUrls } : { text, imageUrls }
                  );
              }}
              color="primary"
              disabled={!text}
            >
              {post ? "更新" : "發布"}
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
      <ToastContainer
        draggable={false}
        hideProgressBar
        position={ToastPosition.BOTTOM_CENTER}
        transition={Slide}
      />
    </div>
  );
};

export { PostDialog };
