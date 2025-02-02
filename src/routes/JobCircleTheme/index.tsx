import { makeStyles, Avatar, CircularProgress } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Header } from "components/Header";
import { themeSubTitles } from "config";
import { useAuth } from "stores";
import {
  PostCard,
  PostDialog,
  QuestionDialog,
  QuestionCard,
} from "components/JobCircle";
import { Post, NewPost } from "@frankyjuang/milkapi-client";
import to from "await-to-js";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router-dom";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import HelpOutlineOutlinedIcon from "@material-ui/icons/HelpOutlineOutlined";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper,
  },
  avatar: {
    width: 40,
    height: 40,
    marginLeft: 16,
    marginRight: 16,
  },
  postButton: {
    flex: 1,
    fontSize: 16,
    paddingTop: 16,
    paddingBottom: 16,
    paddingRight: 8,
    borderColor: theme.palette.divider,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 48,
    paddingLeft: 24,
    textAlign: "left",
    cursor: "pointer",
    alignItems: "center",
    display: "flex",
  },
  postButtonContainer: {
    width: 650,
    [theme.breakpoints.down("xs")]: {
      width: "90%",
    },
    marginLeft: "auto",
    marginRight: "auto",
    alignItems: "center",
    marginBottom: 8,
    display: "flex",
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
  searchRoot: {
    padding: "2px 4px",
    width: 650,
    marginLeft: "auto",
    marginRight: "auto",
    display: "flex",
    alignItems: "center",
    flex: 1,
    marginBottom: 16,
    border: "1px solid #dfe1e5",
    borderRadius: 10,
    "&:hover": {
      boxShadow: "0 2px 4px rgba(0,0,0,0.1) !important",
    },
    [theme.breakpoints.down("xs")]: {
      marginBottom: 16,
      width: "90%",
    },
  },
  iconButton: {
    padding: 10,
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  themeContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    overflow: "scroll",
  },
  themeTag: {
    whiteSpace: "nowrap",
    borderRadius: 8,
    margin: 8,
    padding: 8,
    background: theme.palette.divider,
  },
  themeTitle: {
    fontSize: 24,
    textAlign: "left",
    fontWeight: "bold",
    marginBottom: 8,
    marginLeft: 24,
  },
  themeSubTitle: {
    fontSize: 20,
    textAlign: "left",
    marginBottom: 16,
    marginLeft: 24,
  },
  loading: {
    flex: 1,
    marginTop: 200,
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

const JobCircleTheme: React.FC = () => {
  const classes = useStyles();
  const params = useParams<{ id: string }>();
  const themeTag = "#" + params.id;
  const { getApi, user, loading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [createQuestionOpen, setCreateQuestionOpen] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const pageSize = 5;
  const [ref, inView] = useInView();

  const deletePost = async (postId: string) => {
    if (user) {
      const postApi = await getApi("Post");
      const [err] = await to(postApi.removePost({ postId }));
      if (!err) {
        setPosts(posts.filter((p) => p.uuid !== postId));
      }
    }
  };

  const updatePost = async (post: Post) => {
    if (user) {
      const postApi = await getApi("Post");
      const [err, updatedPost] = await to(
        postApi.updatePost({ postId: post.uuid, post })
      );
      if (updatedPost) {
        updatedPost.creator = user;
        setPosts(
          posts.map((p) => (updatedPost.uuid === p.uuid ? updatedPost : p))
        );
      }
    }
  };

  const createPost = async (newPost: NewPost) => {
    if (user) {
      const postApi = await getApi("Post");
      const [err, createdPost] = await to(
        postApi.addPost({ userId: user?.uuid, newPost })
      );
      if (createdPost) {
        createdPost.creator = user;
        setPosts([createdPost, ...posts]);
      }
    }
  };

  const getPosts = async () => {
    const postApi = await getApi("Post");
    const [err, fetchedPosts] = await to(
      postApi.getPosts({ pageNo, pageSize, text: themeTag })
    );
    fetchedPosts && setPosts([...(pageNo === 1 ? [] : posts), ...fetchedPosts]);
  };

  useEffect(() => {
    inView && setPageNo(pageNo + 1);
  }, [inView]);

  useEffect(() => {
    !loading && pageNo && getPosts();
  }, [pageNo, loading]);

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.container}>
        <div className={classes.themeTitle}>{themeTag.substr(1)}</div>
        <div className={classes.themeSubTitle}>{themeSubTitles[themeTag]}</div>
        <div className={classes.postButtonContainer}>
          <Avatar
            alt="profile image"
            className={classes.avatar}
            src={
              user
                ? user.profileImageUrl
                : "https://milk.jobs/static/media/milk.d3c5757d.png"
            }
          />
          <div
            className={classes.postButton}
            style={{ marginRight: 8 }}
            onClick={() => setCreatePostOpen(true)}
          >
            <CreateOutlinedIcon />
            <div style={{ marginLeft: 8 }}>{"在想什麼？"}</div>
          </div>
          <div
            className={classes.postButton}
            onClick={() => setCreateQuestionOpen(true)}
          >
            <HelpOutlineOutlinedIcon />
            <div style={{ marginLeft: 8 }}>{"想問什麼？"}</div>
          </div>
          <QuestionDialog
            open={createQuestionOpen}
            onClose={() => setCreateQuestionOpen(false)}
            finish={createPost}
            theme={themeTag}
          />
          <PostDialog
            open={createPostOpen}
            onClose={() => setCreatePostOpen(false)}
            finish={createPost}
            theme={themeTag}
          />
        </div>
        {loading ? (
          <CircularProgress className={classes.loading} />
        ) : (
          posts.map((p) =>
            p.text.includes("#提問") ? (
              <QuestionCard
                key={p.uuid}
                question={p}
                updatePost={updatePost}
                deletePost={deletePost}
              />
            ) : (
              <PostCard
                key={p.uuid}
                post={p}
                updatePost={updatePost}
                deletePost={deletePost}
              />
            )
          )
        )}
        <div ref={ref}></div>
      </div>
    </div>
  );
};

export default JobCircleTheme;
