import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import Popper from "@material-ui/core/Popper";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import {
  Button,
  ClickAwayListener,
  IconButton,
  TextField,
} from "@material-ui/core";
import { DeleteOutline } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import { useLocation } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    typography: {
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(1),
      marginLeft: 4,
      marginRight: 4,
      borderBottomStyle: "solid",
      borderBottomWidth: 1,
      borderBottomColor: theme.palette.divider,
    },
  })
);

interface Props {
  word: string;
  deleteWord: () => void;
  sendMessage: (message: string) => void;
}

const CommonWords: React.FC<Props> = ({ word, deleteWord, sendMessage }) => {
  const classes = useStyles();
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);

  return (
    <div
      className={classes.typography}
      onMouseOver={() => setShowDeleteIcon(true)}
      onMouseLeave={() => setShowDeleteIcon(false)}
    >
      <Typography onClick={() => sendMessage(word)}>{word}</Typography>
      <IconButton
        style={{
          marginLeft: "auto",
          visibility: showDeleteIcon ? "visible" : "hidden",
        }}
        onClick={deleteWord}
      >
        <DeleteOutline />
      </IconButton>
    </div>
  );
};

interface PopperProps {
  sendMessage: (message: string) => void;
}

const CommonWordsPopper: React.FC<PopperProps> = ({ sendMessage }) => {
  // Was the message sent by the current user. If so, add a css class
  const classes = useStyles();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [commonWords, setCommonWords] = useState<string[]>([]);
  const [addWord, setAddWord] = useState<string>("");
  const isRecruiter = location.pathname.startsWith("/recruiter");

  const getCommonWordsHistory = () => {
    const words = isRecruiter
      ? localStorage.getItem("RecruiterCommonWords")
      : localStorage.getItem("ApplicantCommonWords");
    if (words && JSON.parse(words).length) setCommonWords(JSON.parse(words));
    else {
      isRecruiter
        ? setCommonWords([
            "可以發一份履歷給我看看嗎？",
            "對不起，我覺得該職位不太適合你，祝你早日找到滿意的工作",
          ])
        : setCommonWords([
            "我可以把我的履歷發給你看看嗎？",
            "我可以去貴公司面試嗎？",
          ]);
    }
  };

  useEffect(() => {
    getCommonWordsHistory();
  }, []);

  useEffect(() => {
    isRecruiter
      ? localStorage.setItem(
          "RecruiterCommonWords",
          JSON.stringify(commonWords)
        )
      : localStorage.setItem(
          "ApplicantCommonWords",
          JSON.stringify(commonWords)
        );
  }, [commonWords]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const addCommonWord = () => {
    setCommonWords([addWord, ...commonWords]);
    setAddWord("");
  };

  const deleteCommonWord = (index: number) => {
    setCommonWords(commonWords.filter((w, i) => i !== index));
  };

  return (
    <>
      <Button onClick={handleClick}>常用語</Button>
      <Popper open={open} anchorEl={anchorEl} placement={"top"} transition>
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Paper elevation={3}>
            <div className={classes.typography}>
              <TextField
                placeholder={"新增常用語"}
                value={addWord}
                onChange={(e) => setAddWord(e.target.value)}
              />
              <IconButton
                style={{
                  marginLeft: "auto",
                }}
                onClick={addCommonWord}
              >
                <AddIcon />
              </IconButton>
            </div>
            {commonWords.map((w, index) => (
              <CommonWords
                word={w}
                key={index}
                deleteWord={() => deleteCommonWord(index)}
                sendMessage={sendMessage}
              />
            ))}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  );
};

export { CommonWordsPopper };
