import { makeStyles, useTheme, Avatar } from "@material-ui/core";
import React, { useState } from "react";
import Linkify from "react-linkify";
import IconButton from "@material-ui/core/IconButton";
import { useAuth } from "stores";
import { Post, NewPost } from "@frankyjuang/milkapi-client";
import EditIcon from "@material-ui/icons/Edit";
import ShareIcon from "@material-ui/icons/Share";
import { PostDialog } from "./";
import { openInNewTab } from "helpers";
import Dialog from "@material-ui/core/Dialog";

const useStyles = makeStyles(theme => ({
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
      borderBottomWidth: 1
    }
  },
  text: {
    textAlign: "left",
    fontSize: 16,
    lineHeight: 2,
    color: "black"
  },
  iconButton: {
    padding: 10
  },
  postIcons: {
    display: "flex",
    flexDirection: "row",
    marginLeft: "auto"
  },
  postIconButton: { padding: 0, marginLeft: 8 },
  input: {
    marginLeft: 8,
    flex: 1
  },
  avatar: {
    width: 40,
    height: 40,
    marginLeft: 16,
    marginRight: 16
  },
  postButtonContainer: {
    width: 650,
    [theme.breakpoints.down("xs")]: {
      width: "90%"
    },
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 8,
    display: "flex"
  },
  postButton: {
    flex: 1,
    fontSize: 16,
    padding: 8,
    borderColor: theme.palette.divider,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 8
  },
  date: {
    color: theme.palette.text.hint,
    marginTop: 4
  },
  more: {
    cursor: "pointer",
    color: theme.palette.secondary.main
  },
  postHeader: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 8,
    width: "100%"
  },
  postAvatar: {
    width: 20,
    height: 20,
    marginRight: 8
  },
  postImage: {
    width: 200,
    height: 200,
    objectFit: "cover",
    marginRight: 8,
    borderRadius: 8,
    "&:hover": {
      cursor: "pointer"
    }
  },
  imagesContainer: {
    width: "100%",
    display: "flex",
    overflow: "scroll",
    flexWrap: "nowrap"
  }
}));

interface PostCardProps {
  post: Post;
  updatePost: (post: Post) => void;
  deletePost: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  updatePost,
  deletePost
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const { user } = useAuth();
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImgUrl, setSelectedImgUrl] = useState<string>("");
  const lines = post.text.split("\n");
  const [editPostOpen, setEditPostOpen] = useState(false);
  const [hideText, setHideText] = useState(lines.length < 7 ? false : true);

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
            <IconButton
              className={classes.postIconButton}
              onClick={() =>
                openInNewTab("https://milk.jobs/circle/" + post.uuid)
              }
            >
              <ShareIcon fontSize={"small"} />
            </IconButton>
          </div>
        </div>
      )}
      {hideText
        ? lines.slice(0, 5).map((t, index) => (
            <div key={t + index} className={classes.text}>
              <Linkify
                properties={{
                  target: "_blank",
                  style: {
                    color: theme.palette.secondary.main,
                    textDecoration: "none"
                  }
                }}
              >
                {t}
              </Linkify>
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
              <Linkify
                properties={{
                  target: "_blank",
                  style: {
                    color: theme.palette.secondary.main,
                    textDecoration: "none"
                  }
                }}
              >
                {t}
              </Linkify>
            </div>
          ))}

      <div className={classes.imagesContainer}>
        {post.imageUrls?.map(i => (
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
    </div>
  );
};

export { PostCard };
