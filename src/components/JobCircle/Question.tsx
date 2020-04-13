import {
  makeStyles,
  Button,
  CircularProgress,
  DialogTitle,
  Avatar
} from "@material-ui/core";
import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { useAuth } from "stores";
import { Post, PostReply } from "@frankyjuang/milkapi-client";
import to from "await-to-js";
import { AnswerCard } from "components/JobCircle";
import { LoginDialog } from "components/Util";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import urljoin from "url-join";
import branch from "branch-sdk";
import { webConfig } from "config";
import { Slide, toast, ToastContainer, ToastPosition } from "react-toastify";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper
  },
  container: {
    marginTop: 40,
    marginBottom: 40,
    display: "flex",
    justifyContent: "center",
    marginRight: "auto",
    marginLeft: "auto",
    paddingRight: 24,
    paddingLeft: 24,
    flexDirection: "column",
    backgroundColor: theme.palette.background.paper,
    width: "720px",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      marginTop: 8,
      marginBottom: 8,
      paddingLeft: 0,
      paddingRight: 0
    }
  },
  loading: {
    flex: 1,
    marginTop: 200,
    marginLeft: "auto",
    marginRight: "auto"
  },
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
    cursor: "pointer",
    alignSelf: "stretch",
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
    fontSize: 18,
    color: "black",
    fontWeight: "bold"
  },
  replyHint: {
    color: theme.palette.text.hint,
    paddingTop: 16
  },
  button: {
    marginRight: 8
  },
  postHeader: {
    display: "flex",
    flexDirection: "row",
    marginTop: 8,
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
  },
  postIcons: {
    display: "flex",
    flexDirection: "row",
    marginLeft: "auto"
  },
  postIconButton: { padding: 0, marginLeft: 8 },
  themeTag: {
    marginTop: 8,
    marginBottom: 8,
    color: theme.palette.secondary.main,
    cursor: "pointer",
    textDecoration: "none"
  }
}));

interface AnswerDialogProps {
  isOpen: boolean;
  close: () => void;
  title?: string;
  replyQuestion: (answer: string) => void;
}

const AnswerDialog: React.FC<AnswerDialogProps> = ({
  isOpen,
  close,
  title,
  replyQuestion
}) => {
  const [text, setText] = useState("");

  return (
    <Dialog
      open={isOpen}
      onClose={close}
      aria-labelledby="form-dialog-title"
      fullWidth
    >
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
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
        <Button onClick={close} color="primary">
          取消
        </Button>
        <Button
          onClick={() => {
            close();
            replyQuestion(text);
          }}
          color="primary"
        >
          回答
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface QuestionProps {
  question: Post;
}

const Question: React.FC<QuestionProps> = ({ question: q }) => {
  const classes = useStyles();
  const { getApi, user } = useAuth();
  const history = useHistory();
  const [question] = useState<Post>(q);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [deleteQuestionDialogOpen, setDeleteQuestionDialogOpen] = useState(
    false
  );
  const themeTag = question.text
    .split("\n")
    .filter(l => l.includes("#提問"))[0]
    .replace("#提問", "");
  console.warn(themeTag);
  const [answerDialogOpen, setAnswerDialogOpen] = useState(false);
  const [answers, setAnswers] = useState<PostReply[]>([]);
  const [answerPageNo, setAnswerPageNo] = useState<number>(1);
  const answerPageSize = 10;

  const updateAnswer = async (answer: PostReply) => {
    if (user) {
      const postApi = await getApi("Post");
      const [err, updatedAnswer] = await to(
        postApi.updatePostReply({
          postId: question.uuid,
          replyId: answer.uuid,
          postReply: answer
        })
      );
      if (updatedAnswer) {
        updatedAnswer.replier = user;
        setAnswers(
          answers.map(a => (a.uuid === updatedAnswer.uuid ? updatedAnswer : a))
        );
      }
    }
  };

  const deleteQuestion = async () => {
    if (user) {
      const postApi = await getApi("Post");
      const [err] = await to(postApi.removePost({ postId: question.uuid }));
      !err && history.push("/circle");
    }
  };

  const deleteAnswer = async (answerId: string) => {
    if (user) {
      const postApi = await getApi("Post");
      const [err] = await to(
        postApi.removePostReply({ postId: question.uuid, replyId: answerId })
      );
      !err && setAnswers(answers.filter(a => a.uuid !== answerId));
    }
  };

  const getShareUrl = useCallback(async () => {
    if (question) {
      const url = urljoin(webConfig.basePath, "question", question.uuid);
      branch.link(
        {
          channel: "app",
          feature: "share",
          data: {
            $desktop_url: url,
            $ios_url: url,
            $ipad_url: url,
            $android_url: url,
            $og_title: "邀請回答 : " + question.text.split("\n")[0],
            $og_description: question.text
          }
        },
        function(err, link) {
          err
            ? toast.error("獲取連結失敗，可能是廣告阻擋插件造成的影響。")
            : toast.success("已複製分享連結到剪貼簿");
          navigator.clipboard.writeText(link);
        }
      );
    }
  }, [branch, question]);

  const getPostReplies = async () => {
    if (question) {
      const postApi = await getApi("Post");
      const [err, fetchedPostReplies] = await to(
        postApi.getPostReplies({
          postId: question.uuid,
          pageNo: answerPageNo,
          pageSize: answerPageSize
        })
      );
      setAnswers([...answers, ...fetchedPostReplies]);
    }
  };

  const replyQuestion = async (answerText: string) => {
    if (user?.uuid && question) {
      const postApi = await getApi("Post");
      const [err, newAnswer] = await to(
        postApi.addPostReply({
          postId: question.uuid,
          newPostReply: { text: answerText, replierId: user?.uuid }
        })
      );
      if (newAnswer) {
        newAnswer.replier = user;
        setAnswers([newAnswer, ...answers]);
      }
    } else {
      setLoginDialogOpen(true);
    }
  };

  useEffect(() => {
    if (question && question.replyCount) getPostReplies();
  }, [answerPageNo, question]);

  return (
    <div className={classes.container}>
      {!question ? (
        <CircularProgress className={classes.loading} />
      ) : (
        <>
          <div className={classes.postContainer}>
            {question.text
              .split("\n")
              .filter(l => !l.includes("#提問"))
              .map((l, index) => (
                <div className={classes.text} key={index}>
                  {l}
                </div>
              ))}
            {themeTag && (
              <Link
                to={"/circle/theme/" + themeTag.replace("#", "")}
                className={classes.themeTag}
              >
                {themeTag}
              </Link>
            )}
            {question && question.creator && (
              <div className={classes.postHeader}>
                <Link
                  to={"/public-profile/" + question.creator.uuid}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    textDecoration: "none"
                  }}
                >
                  <Avatar
                    alt="profile image"
                    className={classes.postAvatar}
                    src={question.creator.profileImageUrl}
                  />
                  <div className={classes.name}>{question.creator.name}</div>
                </Link>
                <div className={classes.postIcons}>
                  {user && user.uuid === question.creator.uuid && (
                    <IconButton
                      className={classes.postIconButton}
                      onClick={() => setDeleteQuestionDialogOpen(true)}
                    >
                      <DeleteIcon fontSize={"small"} />
                    </IconButton>
                  )}
                  <Dialog
                    open={deleteQuestionDialogOpen}
                    onClose={() => setDeleteQuestionDialogOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {"確定刪除這則提問？"}
                    </DialogTitle>
                    <DialogActions>
                      <Button
                        onClick={() => setDeleteQuestionDialogOpen(false)}
                        color="primary"
                      >
                        取消
                      </Button>
                      <Button
                        onClick={() => {
                          setDeleteQuestionDialogOpen(false);
                          deleteQuestion();
                        }}
                        color="primary"
                      >
                        確定
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>
              </div>
            )}
            <div className={classes.replyHint}>
              <Button
                variant={"outlined"}
                color={"secondary"}
                className={classes.button}
                onClick={() => setAnswerDialogOpen(true)}
              >
                {"寫回答"}
              </Button>
              <Button
                variant={"outlined"}
                className={classes.button}
                onClick={getShareUrl}
              >
                {"邀請回答"}
              </Button>
              {question.replyCount
                ? `已有 ${question.replyCount} 個回答`
                : "還沒有人回答"}
            </div>
          </div>
          <div>
            {answers.map(a => (
              <AnswerCard
                answer={a}
                key={a.uuid}
                updateAnswer={updateAnswer}
                deleteAnswer={deleteAnswer}
              />
            ))}
          </div>
        </>
      )}
      <AnswerDialog
        isOpen={answerDialogOpen}
        close={() => setAnswerDialogOpen(false)}
        title={question?.text
          .split("\n")
          .filter(l => !l.includes("#提問"))
          .join("\n")}
        replyQuestion={replyQuestion}
      />
      <LoginDialog
        isOpen={loginDialogOpen}
        close={() => setLoginDialogOpen(false)}
      />
      <ToastContainer
        draggable={false}
        hideProgressBar
        position={ToastPosition.BOTTOM_CENTER}
        transition={Slide}
      />
    </div>
  );
};

export { Question };
