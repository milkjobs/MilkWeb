import { makeStyles, CircularProgress } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Header } from "components/Header";
import { useParams } from "react-router-dom";
import { useAuth } from "stores";
import { Post as PostType } from "@frankyjuang/milkapi-client";
import to from "await-to-js";
import { Post, Question } from "components/JobCircle";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper,
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
      paddingRight: 0,
    },
  },
  circleLink: {
    padding: 32,
    textDecoration: "none",
    fontSize: 18,
    color: theme.palette.text.secondary,
  },
  downloadHint: {
    color: theme.palette.text.secondary,
    marginTop: 64,
    fontSize: 16,
  },
  loading: {
    flex: 1,
    marginTop: 200,
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

const JobCircle: React.FC = () => {
  const classes = useStyles();
  const params = useParams<{ id: string }>();
  const { getApi, loading } = useAuth();
  const [post, setPost] = useState<PostType>();

  const getPost = async () => {
    const postApi = await getApi("Post");
    const [err, fetchedPost] = await to(postApi.getPost({ postId: params.id }));
    fetchedPost && setPost(fetchedPost);
  };

  useEffect(() => {
    !loading && getPost();
  }, [loading]);

  return (
    <div className={classes.root}>
      <Header />
      {!post ? (
        <CircularProgress className={classes.loading} />
      ) : post.text.includes("#提問") ? (
        <Question question={post} />
      ) : (
        <Post post={post} />
      )}
    </div>
  );
};

export default JobCircle;
