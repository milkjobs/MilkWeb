import { makeStyles, Button, useMediaQuery, useTheme } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { useAuth } from "stores";
import { AppStore, GooglePlay } from "assets/icons";
import { Dark, Home, Job, Manage, Chat } from "assets/mockup";
import { getMobileOS, MobileOS, openInNewTab } from "helpers";
import QRCode from "qrcode.react";
import { Post as PostType } from "@frankyjuang/milkapi-client";
import to from "await-to-js";
import { PostCard } from "components/JobCircle";
import { TeamCreateForm } from "components/TeamComponents";
import { LoginDialog } from "components/Util";
import { UserCard } from "components/Profile";

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
    flexDirection: "row",
    backgroundColor: theme.palette.background.paper,
  },
  circlesContainer: {
    display: "flex",
    justifyContent: "center",
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
  userCardContainer: {
    [theme.breakpoints.up("md")]: {
      minWidth: "250px",
    },
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  // container: {
  //   marginTop: 40,
  //   marginBottom: 40,
  //   display: "flex",
  //   justifyContent: "center",
  //   marginRight: "auto",
  //   marginLeft: "auto",
  //   paddingRight: 24,
  //   paddingLeft: 24,
  //   flexDirection: "column",
  //   backgroundColor: theme.palette.background.paper,
  //   width: "720px",
  //   [theme.breakpoints.down("xs")]: {
  //     width: "100%",
  //     marginTop: 8,
  //     marginBottom: 8,
  //     paddingLeft: 0,
  //     paddingRight: 0,
  //   },
  // },
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
  title: {
    fontSize: 24,
    fontWeight: 500,
    marginTop: 24,
    marginBottom: 24,
  },
  appContainer: {
    flex: 1,
    padding: 24,
  },
  image: {
    height: "100%",
    position: "absolute",
    top: 0,
    right: 0,
    opacity: 0,
    transition: "opacity 500ms ease-in-out",
  },
  mobileImage: {
    height: 500,
    transition: "opacity 500ms ease-in-out",
  },
}));

interface Slide {
  title: string;
  image: string;
}

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post: p }) => {
  const classes = useStyles();
  const params = useParams<{ id: string }>();
  const { getApi, user } = useAuth();
  const history = useHistory();
  const theme = useTheme();
  const [createTeamFormOpen, setCreateTeamFormOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [post, setPost] = useState<PostType>(p);
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const slides: Slide[] = [
    { title: "職缺管理，一目瞭然", image: Manage },
    { title: "不漏接任何訊息", image: Chat },
    { title: "保護眼睛，更加專注", image: Dark },
    { title: "手機完成，輕鬆自在", image: Home },
    { title: "簡單直覺，切中要點", image: Job },
  ];
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

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

  useEffect(() => {
    let timer: number | undefined;
    timer = window.setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className={classes.container}>
      <div className={classes.circlesContainer}>
        <PostCard
          post={post}
          updatePost={updatePost}
          deletePost={deletePost}
          expand={true}
        />
        <div style={{ marginTop: 80, marginBottom: 80 }}>
          <Link to={"/"} className={classes.circleLink}>
            <Button variant={"contained"} color={"primary"}>
              看更多工作
            </Button>
          </Link>
          {user ? (
            !user.recruiterInfo ? (
              <Button
                variant={"contained"}
                color={"secondary"}
                onClick={() =>
                  isMobile
                    ? openInNewTab("https://to.milk.jobs/app")
                    : setCreateTeamFormOpen(true)
                }
              >
                免費刊登職缺
              </Button>
            ) : (
              <Link to="/recruiter" className={classes.circleLink}>
                <Button variant={"contained"} color={"secondary"}>
                  切換成招募模式
                </Button>
              </Link>
            )
          ) : (
            <Button
              variant={"contained"}
              color={"secondary"}
              onClick={() =>
                isMobile
                  ? openInNewTab("https://to.milk.jobs/app")
                  : setLoginDialogOpen(true)
              }
            >
              免費刊登職缺
            </Button>
          )}
          <TeamCreateForm
            handleClose={() => setCreateTeamFormOpen(false)}
            open={createTeamFormOpen}
          />
          <LoginDialog
            isOpen={loginDialogOpen}
            close={() => setLoginDialogOpen(false)}
          />
        </div>
        {/* <div
          style={{
            display: "flex",
            width: "720px",
            minHeight: "72%",
            padding: 32,
          }}
        >
          {!isMobile && (
            <div
              className={classes.appContainer}
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <div style={{ position: "relative" }}>
                {slides.map((item, index) => (
                  <img
                    key={index}
                    alt="screenshot"
                    src={item.image}
                    className={classes.image}
                    style={
                      currentSlideIndex === index ? { opacity: 1 } : undefined
                    }
                  />
                ))}
              </div>
            </div>
          )}
          <div
            className={classes.appContainer}
            style={
              isMobile
                ? {
                    marginTop: "auto",
                    marginBottom: "auto",
                    padding: 0,
                  }
                : {
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }
            }
          >
            <div>
              {isMobile && (
                <div
                  style={{
                    position: "relative",
                    height: 500,
                    marginBottom: 32,
                  }}
                >
                  <img
                    alt="screenshot"
                    src={slides[currentSlideIndex].image}
                    className={classes.mobileImage}
                    style={{ opacity: 1 }}
                  />
                </div>
              )}
              <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 24 }}>
                找人才，直接聊
              </div>
              <div className={classes.title}>
                {slides[currentSlideIndex].title}
              </div>
              {isMobile ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {getMobileOS() !== MobileOS.Android && (
                    <a href="https://to.milk.jobs/app">
                      <img alt="app store" src={AppStore} width="200" />
                    </a>
                  )}
                  {getMobileOS() !== MobileOS.Ios && (
                    <a href="https://to.milk.jobs/app">
                      <img alt="google play" src={GooglePlay} width="230" />
                    </a>
                  )}
                </div>
              ) : (
                <QRCode
                  size={240}
                  level="Q"
                  value="https://to.milk.jobs/app"
                  includeMargin
                />
              )}
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  marginBottom: 12,
                  marginTop: isMobile ? 12 : 0,
                }}
              >
                下載牛奶找工作 App
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  marginBottom: 24,
                  marginTop: isMobile ? 12 : 0,
                }}
              >
                免費刊登職缺
              </div>
            </div>
          </div> */}
        {/* </div> */}
      </div>
      <div className={classes.userCardContainer}>
        <UserCard />
      </div>
    </div>
    // </div>
  );
};

export { Post };
