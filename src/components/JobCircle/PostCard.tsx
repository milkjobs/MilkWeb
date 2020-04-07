import { makeStyles, useTheme, Avatar, TextField } from "@material-ui/core";
import React, { useState, useCallback, useEffect } from "react";
import Linkify from "react-linkify";
import IconButton from "@material-ui/core/IconButton";
import { useAuth } from "stores";
import { Post, NewPost, PostReply } from "@frankyjuang/milkapi-client";
import EditIcon from "@material-ui/icons/Edit";
import { PostDialog } from "./";
import { themeSubTitles } from "config";
import { Slide, toast, ToastContainer, ToastPosition } from "react-toastify";
import Dialog from "@material-ui/core/Dialog";
import branch from "branch-sdk";
import { webConfig } from "config";
import CommentOutlinedIcon from "@material-ui/icons/CommentOutlined";
import ShareOutlinedIcon from "@material-ui/icons/ShareOutlined";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import urljoin from "url-join";
import to from "await-to-js";
import { LoginDialog } from "components/Util";
import ReactHashTag from "react-hashtag";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  actionButtonsContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    paddingTop: 16,
    paddingBottom: 16,
  },
  actionButton: {
    flex: 1,
    fontSize: 16,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    justifyContent: "center",
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
    fontSize: 16,
    lineHeight: 2,
    color: "black",
  },
  iconButton: {
    padding: 10,
  },
  postIcons: {
    display: "flex",
    flexDirection: "row",
    marginLeft: "auto",
  },
  postIconButton: { padding: 0, marginLeft: 8 },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    marginLeft: 16,
    marginRight: 16,
  },
  postButtonContainer: {
    width: 650,
    [theme.breakpoints.down("xs")]: {
      width: "90%",
    },
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 8,
    display: "flex",
  },
  postButton: {
    flex: 1,
    fontSize: 16,
    padding: 8,
    borderColor: theme.palette.divider,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 8,
  },
  date: {
    color: theme.palette.text.hint,
    marginTop: 4,
  },
  more: {
    cursor: "pointer",
    color: theme.palette.secondary.main,
  },
  postHeader: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 8,
    width: "100%",
  },
  postAvatar: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  postImage: {
    width: 200,
    height: 200,
    objectFit: "cover",
    marginRight: 8,
    borderRadius: 8,
    "&:hover": {
      cursor: "pointer",
    },
  },
  imagesContainer: {
    width: "100%",
    display: "flex",
    overflow: "scroll",
    flexWrap: "nowrap",
  },
  commentInputContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  commentInput: {
    flex: 1,
    borderRadius: 12,
    marginLeft: 16,
  },
  commentAvatar: {
    width: 30,
    height: 30,
  },
  replyContainer: {
    width: "100%",
    display: "flex",
    marginTop: 8,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  replyAvatar: {
    width: 30,
    height: 30,
  },
  replyTextContainer: {
    marginLeft: 16,
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    justifyContent: "start",
  },
  replyName: {
    fontWeight: "bold",
  },
  hashTag: {
    color: theme.palette.secondary.main,
    textDecoration: "none",
  },
  replyText: {},
}));

interface PostCardProps {
  post: Post;
  updatePost: (post: Post) => void;
  deletePost: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  updatePost,
  deletePost,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const { user, getApi } = useAuth();
  const [liked, setLiked] = useState(post.liked);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [selectedImgUrl, setSelectedImgUrl] = useState<string>("");
  const lines = post.text.split("\n");
  const [editPostOpen, setEditPostOpen] = useState(false);
  const [hideText, setHideText] = useState(lines.length < 7 ? false : true);
  const [postReplies, setPostReplies] = useState<PostReply[]>([]);
  const [postReplyPageNo, setPostReplyPageNo] = useState<number>(1);
  const [replyText, setReplyText] = useState("");
  const postReplyPageSize = 10;

  const replyPost = async () => {
    if (user?.uuid) {
      const postApi = await getApi("Post");
      const [err, newPostReply] = await to(
        postApi.addPostReply({
          postId: post.uuid,
          newPostReply: { text: replyText, replierId: user?.uuid },
        })
      );
      if (newPostReply) {
        newPostReply.replier = user;
        setPostReplies([newPostReply, ...postReplies]);
      }
      setReplyText("");
    } else {
      setLoginDialogOpen(true);
    }
  };

  const getPostReplies = async () => {
    const postApi = await getApi("Post");
    const [err, fetchedPostReplies] = await to(
      postApi.getPostReplies({
        postId: post.uuid,
        pageNo: postReplyPageNo,
        pageSize: postReplyPageSize,
      })
    );
    setPostReplies([...postReplies, ...fetchedPostReplies]);
  };

  useEffect(() => {
    if (post.replyCount) getPostReplies();
  }, [postReplyPageNo]);

  const getShareUrl = useCallback(async () => {
    const url = urljoin(webConfig.basePath, "circle", post.uuid);
    branch.link(
      {
        channel: "app",
        feature: "share",
        data: {
          $desktop_url: url,
          $ios_url: url,
          $ipad_url: url,
          $android_url: url,
          $og_title: post.text.split("\n")[0],
          $og_description: post.text,
          $og_image_url: post.imageUrls ? post.imageUrls[0] : undefined,
        },
      },
      function(err, link) {
        err
          ? toast.error("獲取連結失敗，可能是廣告阻擋插件造成的影響。")
          : toast.success("已複製分享連結到剪貼簿");
        navigator.clipboard.writeText(link);
      }
    );
  }, [branch, post]);
  const linkifyOptions = {
    formatHref: function(href, type) {
      if (type === "hashtag") {
        href = "https://twitter.com/hashtag/" + href.substring(1);
      }
      return href;
    },
  };

  const like = async () => {
    if (user) {
      const userApi = await getApi("User");
      if (!liked) {
        const [err] = await to(
          userApi.likePost({
            userId: user?.uuid,
            postId: post.uuid,
          })
        );
        setLiked(true);
      } else {
        const [err] = await to(
          userApi.unlikePost({
            userId: user?.uuid,
            postId: post.uuid,
          })
        );
        setLiked(false);
      }
    } else {
      setLoginDialogOpen(true);
    }
  };

  return (
    <div className={classes.postContainer}>
      {post.creator && (
        <div className={classes.postHeader}>
          <Avatar
            alt="profile image"
            className={classes.postAvatar}
            src={post.creator.profileImageUrl}
          />
          <div>{post.creator.name}</div>
          <div className={classes.postIcons}>
            {user && user.uuid === post.creator.uuid && (
              <>
                <IconButton
                  className={classes.postIconButton}
                  onClick={() => setEditPostOpen(true)}
                >
                  <EditIcon fontSize={"small"} />
                </IconButton>
                <PostDialog
                  open={editPostOpen}
                  delete={deletePost}
                  post={post}
                  onClose={() => setEditPostOpen(false)}
                  finish={(post: NewPost | Post) =>
                    "uuid" in post && updatePost(post)
                  }
                />
              </>
            )}
          </div>
        </div>
      )}
      {hideText
        ? lines.slice(0, 5).map((t, index) => (
            <div key={t + index} className={classes.text}>
              {t.includes("#") ? (
                <ReactHashTag
                  renderHashtag={(hashtagValue) => (
                    <Link
                      to={
                        hashtagValue in themeSubTitles
                          ? "/circle/theme/" + hashtagValue.substr(1)
                          : "/circle"
                      }
                      className={classes.hashTag}
                    >
                      {hashtagValue}
                    </Link>
                  )}
                >
                  {t}
                </ReactHashTag>
              ) : (
                <Linkify
                  properties={{
                    target: "_blank",
                    style: {
                      color: theme.palette.secondary.main,
                      textDecoration: "none",
                    },
                  }}
                >
                  {t}
                </Linkify>
              )}
              {index === 4 && (
                <div
                  className={classes.more}
                  onClick={() => setHideText(false)}
                >
                  {"查看更多"}
                </div>
              )}
            </div>
          ))
        : lines.map((t, index) => (
            <div key={t + index} className={classes.text}>
              {t.includes("#") ? (
                <ReactHashTag
                  renderHashtag={(hashtagValue) => (
                    <Link
                      to={
                        hashtagValue in themeSubTitles
                          ? "/circle/theme/" + hashtagValue.substr(1)
                          : "/circle"
                      }
                      className={classes.hashTag}
                    >
                      {hashtagValue}
                    </Link>
                  )}
                >
                  {t}
                </ReactHashTag>
              ) : (
                <Linkify
                  properties={{
                    target: "_blank",
                    style: {
                      color: theme.palette.secondary.main,
                      textDecoration: "none",
                    },
                  }}
                >
                  {t}
                </Linkify>
              )}
            </div>
          ))}

      <div className={classes.imagesContainer}>
        {post.imageUrls?.map((i) => (
          <img
            key={i}
            src={i}
            alt="照片"
            className={classes.postImage}
            onClick={() => {
              setImageDialogOpen(true);
              setSelectedImgUrl(i);
            }}
          ></img>
        ))}
      </div>
      <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)}>
        <img
          src={selectedImgUrl}
          style={{ height: "100%", width: "100%", objectFit: "contain" }}
        />
      </Dialog>
      <div className={classes.date}>{post.createdAt.toLocaleDateString()}</div>
      <div className={classes.actionButtonsContainer}>
        <div className={classes.actionButton} onClick={() => like()}>
          {liked ? (
            <FavoriteIcon style={{ marginRight: 8 }} />
          ) : (
            <FavoriteBorderIcon style={{ marginRight: 8 }} />
          )}
          {post.likeCount ? post.likeCount : "喜歡"}
        </div>
        <div className={classes.actionButton}>
          <CommentOutlinedIcon style={{ marginRight: 8 }} />
          {post.replyCount ? post.replyCount : "留言"}
        </div>
        <div className={classes.actionButton} onClick={() => getShareUrl()}>
          <ShareOutlinedIcon style={{ marginRight: 8 }} />
          {"分享"}
        </div>
      </div>
      <div className={classes.commentInputContainer}>
        <Avatar
          alt="profile image"
          className={classes.commentAvatar}
          src={user?.profileImageUrl}
        />
        <TextField
          id="outlined-basic"
          variant="outlined"
          className={classes.commentInput}
          size={"small"}
          placeholder={"我來說幾句"}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && replyPost()}
        />
      </div>
      {postReplies.map((r) => (
        <div className={classes.replyContainer} key={r.uuid}>
          <Avatar
            alt="profile image"
            className={classes.replyAvatar}
            src={r.replier?.profileImageUrl}
          />
          <div className={classes.replyTextContainer}>
            <div className={classes.replyName}>{r.replier?.name}</div>
            <div className={classes.replyText}>{r.text}</div>
          </div>
        </div>
      ))}
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

export { PostCard };
