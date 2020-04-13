import { makeStyles, Button } from "@material-ui/core";
import React, { useState } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { useAuth } from "stores";
import { Post as PostType } from "@frankyjuang/milkapi-client";
import to from "await-to-js";
import { PostCard } from "components/JobCircle";
import { DownloadApp } from "components/Util";

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
  },
  downloadHint: {
    color: theme.palette.text.secondary,
    marginTop: 64,
    fontSize: 16
  },
  loading: {
    flex: 1,
    marginTop: 200,
    marginLeft: "auto",
    marginRight: "auto"
  }
}));

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post: p }) => {
  const classes = useStyles();
  const params = useParams<{ id: string }>();
  const { getApi, user } = useAuth();
  const history = useHistory();
  const [downloadAppOpen, setDownloadAppOpen] = useState(false);
  const [post, setPost] = useState<PostType>(p);
  const recruiterMode = Math.random() > 0.5;

  const updatePost = async (post: PostType) => {
    if (user) {
      const postApi = await getApi("Post");
      const [err, updatedPost] = await to(
        postApi.updatePost({ postId: post.uuid, post })
      );
      if (updatedPost) {
        updatedPost.creator = user;
        setPost(updatedPost);
      }
    }
  };
  const deletePost = async (postId: string) => {
    if (user) {
      const postApi = await getApi("Post");
      const [err] = await to(postApi.removePost({ postId }));
      if (!err) {
        history.push("/circle");
      }
    }
  };

  return (
    <div className={classes.container}>
      <PostCard post={post} updatePost={updatePost} deletePost={deletePost} />
      {params.id && (
        <Link to={"/circle"} className={classes.circleLink}>
          {"看所有的工作圈"}
        </Link>
      )}
      <Button
        className={classes.downloadHint}
        onClick={() => setDownloadAppOpen(true)}
      >
        {recruiterMode
          ? "找人才？來牛奶找工作 App 免費刊登職缺"
          : "想獲得全台灣最新的徵才訊息？來牛奶找工作 App"}
      </Button>
      <DownloadApp
        recruiterMode
        isOpen={downloadAppOpen}
        close={() => setDownloadAppOpen(false)}
      />
    </div>
  );
};

export { Post };
