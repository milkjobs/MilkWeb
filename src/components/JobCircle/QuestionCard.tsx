import { makeStyles, useTheme, Avatar, TextField } from "@material-ui/core";
import React, { useState, useCallback, useEffect } from "react";
import { Post } from "@frankyjuang/milkapi-client";
import { Link, useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
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
    textDecoration: "none",
    [theme.breakpoints.down("xs")]: {
      marginLeft: 16,
      marginRight: 16,
      borderRadius: 0,
      borderColor: theme.palette.divider,
      borderStyle: "solid",
      borderWidth: 0,
      borderBottomWidth: 1,
    },
  },
  text: {
    textAlign: "left",
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
  replyHint: {
    color: theme.palette.text.hint,
    marginTop: 8,
  },
}));

interface QuestionCardProps {
  question: Post;
  updatePost: (post: Post) => void;
  deletePost: (postId: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  updatePost,
  deletePost,
}) => {
  const classes = useStyles();
  const lines = question.text.split("\n").filter((l) => !l.includes("#提問"));
  const location = useLocation();
  const isRecruiter = location.pathname.startsWith("/recruiter");

  return (
    <Link
      className={classes.postContainer}
      to={(isRecruiter ? "/recruiter/circle/" : "/circle/") + question.uuid}
      target={"_blank"}
    >
      {lines.map((l, index) => (
        <div className={classes.text} key={index}>
          {l}
        </div>
      ))}
      <div className={classes.replyHint}>
        {question.replyCount
          ? `已有 ${question.replyCount} 個回答`
          : "還沒有人回答"}
      </div>
    </Link>
  );
};

export { QuestionCard };
