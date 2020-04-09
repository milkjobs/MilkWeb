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
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import DeleteIcon from "@material-ui/icons/Delete";

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
  actionButtonLike: {
    flex: 1,
    color: theme.palette.secondary.main,
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
    textDecoration: "none",
  },
  postAvatar: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  postImage: {
    minWidth: 200,
    minHeight: 200,
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
  name: {
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
  replyContainer: {
    width: "100%",
    display: "flex",
    marginTop: 8,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    textDecoration: "none",
  },
  replyAvatar: {
    width: 30,
    height: 30,
  },
  replyTextContainer: {
    marginLeft: 16,
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    alignItems: "start",
    justifyContent: "start",
  },
  replyName: {
    fontWeight: "bold",
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
  hashTag: {
    color: theme.palette.secondary.main,
    textDecoration: "none",
  },
  replyText: {
    color: theme.palette.text.primary,
  },
}));

interface ReplyProps {
  reply: PostReply;
  deleteReply: (replyId: string) => void;
}

const Reply: React.FC<ReplyProps> = ({ reply, deleteReply }) => {
  const classes = useStyles();
  const theme = useTheme();
  const lines = reply.text.split("\n");
  const { user } = useAuth();
  const [hideText, setHideText] = useState(
    lines.length < 2 && lines[0].length < 35 ? false : true
  );

  return (
    <div className={classes.replyContainer}>
      <Avatar
        alt="profile image"
        className={classes.replyAvatar}
        src={reply.replier?.profileImageUrl}
      />
      <div className={classes.replyTextContainer}>
        <Link
          to={"/public-profile/" + reply.replier?.uuid}
          className={classes.replyName}
        >
          {reply.replier?.name}
        </Link>
        {hideText ? (
          <div className={classes.replyText}>
            {lines[0].slice(0, 35).includes("#") ? (
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
                {lines[0].slice(0, 35)}
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
                {lines[0].slice(0, 35)}
              </Linkify>
            )}
            <div className={classes.more} onClick={() => setHideText(false)}>
              {"查看更多"}
            </div>
          </div>
        ) : (
          lines.map((t, index) => (
            <div key={t + index} className={classes.replyText}>
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
          ))
        )}
      </div>
      {user && reply.replier && user.uuid === reply.replier.uuid && (
        <IconButton
          onClick={() => deleteReply(reply.uuid)}
          style={{ marginLeft: "auto" }}
        >
          <DeleteIcon />
        </IconButton>
      )}
    </div>
  );
};

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
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [selectedImgUrlIndex, setSelectedImgUrlIndex] = useState<number>(0);
  const lines = post.text.split("\n");
  const [editPostOpen, setEditPostOpen] = useState(false);
  const [hideText, setHideText] = useState(lines.length < 7 ? false : true);
  const [postReplies, setPostReplies] = useState<PostReply[]>([]);
  const [postReplyPageNo, setPostReplyPageNo] = useState<number>(1);
  const [replyText, setReplyText] = useState("");
  const postReplyPageSize = 10;

  const deleteReply = async (replyId: string, postId: string) => {
    const postApi = await getApi("Post");
    const [err] = await to(postApi.removePostReply({ replyId, postId }));
    !err && setPostReplies(postReplies.filter((r) => r.uuid !== replyId));
  };

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
        setLikeCount(likeCount + 1);
      } else {
        const [err] = await to(
          userApi.unlikePost({
            userId: user?.uuid,
            postId: post.uuid,
          })
        );
        setLiked(false);
        setLikeCount(likeCount - 1);
      }
    } else {
      setLoginDialogOpen(true);
    }
  };

  return (
    <div className={classes.postContainer}>
      {post.creator && (
        <div className={classes.postHeader}>
          <Link
            to={"/public-profile/" + post.creator.uuid}
            style={{
              display: "flex",
              flexDirection: "row",
              textDecoration: "none",
            }}
          >
            <Avatar
              alt="profile image"
              className={classes.postAvatar}
              src={post.creator.profileImageUrl}
            />
            <div className={classes.name}>{post.creator.name}</div>
          </Link>
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
        {post.imageUrls?.map((i, index) => (
          <img
            key={i}
            src={i}
            alt="照片"
            className={classes.postImage}
            onClick={() => {
              setImageDialogOpen(true);
              setSelectedImgUrlIndex(index);
            }}
          ></img>
        ))}
      </div>
      <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)}>
        {post.imageUrls && (
          <>
            <img
              src={post.imageUrls[selectedImgUrlIndex]}
              style={{ height: "100%", width: "100%", objectFit: "contain" }}
            />
            <IconButton
              style={{ position: "absolute", left: 0, top: "50%" }}
              onClick={() =>
                selectedImgUrlIndex &&
                setSelectedImgUrlIndex(selectedImgUrlIndex - 1)
              }
            >
              <KeyboardArrowLeftIcon />
            </IconButton>
            <IconButton
              style={{ position: "absolute", right: 0, top: "50%" }}
              onClick={() =>
                post.imageUrls?.length &&
                selectedImgUrlIndex < post.imageUrls?.length - 1 &&
                setSelectedImgUrlIndex(selectedImgUrlIndex + 1)
              }
            >
              <KeyboardArrowRightIcon />
            </IconButton>
          </>
        )}
      </Dialog>
      <div className={classes.date}>{post.createdAt.toLocaleDateString()}</div>
      <div className={classes.actionButtonsContainer}>
        <div
          className={liked ? classes.actionButtonLike : classes.actionButton}
          onClick={() => like()}
        >
          {liked ? (
            <FavoriteIcon style={{ marginRight: 8 }} color={"secondary"} />
          ) : (
            <FavoriteBorderIcon style={{ marginRight: 8 }} />
          )}
          {likeCount ? likeCount : "喜歡"}
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
          multiline
          className={classes.commentInput}
          size={"small"}
          placeholder={"我來說幾句"}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          onKeyDown={(e) => !e.shiftKey && e.keyCode == 13 && replyPost()}
        />
      </div>
      {postReplies.map((r) => (
        <Reply
          key={r.uuid}
          reply={r}
          deleteReply={(replyId) => deleteReply(replyId, post.uuid)}
        />
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
