import { makeStyles, Avatar } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Header } from "components/Header";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "stores";
import { Post, NewPost } from "@frankyjuang/milkapi-client";
import to from "await-to-js";
import { PostCard } from "components/JobCircle";

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
  circleLink: {
    padding: 32,
    textDecoration: "none",
    fontSize: 18,
    color: theme.palette.text.secondary
  }
}));

const JobCircle: React.FC = () => {
  const classes = useStyles();
  const params = useParams<{ id: string }>();
  const { getApi, user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);

  const updatePost = async (post: Post) => {
    if (user) {
      const postApi = await getApi("Post");
      const [err, updatedPost] = await to(
        postApi.updatePost({ postId: post.uuid, post })
      );
      if (updatedPost) {
        updatedPost.creator = user;
        setPosts(
          posts.map(p => (updatedPost.uuid === p.uuid ? updatedPost : p))
        );
      }
    }
  };
  const deletePost = async (postId: string) => {
    if (user) {
      const postApi = await getApi("Post");
      const [err] = await to(postApi.removePost({ postId }));
      if (!err) {
        setPosts(posts.filter(p => p.uuid !== postId));
      }
    }
  };

  const getPost = async () => {
    const postApi = await getApi("Post");
    const [err, fetchedPost] = await to(postApi.getPost({ postId: params.id }));
    fetchedPost && setPosts([fetchedPost]);
  };

  useEffect(() => {
    getPost();
  }, []);

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.container}>
        {posts
          .filter(p => p.uuid === params.id)
          .map(p => (
            <PostCard
              key={p.uuid}
              post={p}
              updatePost={updatePost}
              deletePost={deletePost}
            />
          ))}
      </div>
      {params.id && (
        <Link to={"/circle"} className={classes.circleLink}>
          {"看所有的工作圈"}
        </Link>
      )}
    </div>
  );
};

export default JobCircle;
