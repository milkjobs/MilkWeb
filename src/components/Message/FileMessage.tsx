import { createStyles, makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import { Dialog } from "@material-ui/core";
import { openInNewTab } from "helpers";

const useStyles = makeStyles((theme) =>
  createStyles({
    message: {
      margin: 16,
      display: "flex",
      alignItems: "center",
    },
    imageMessage: {
      marginLeft: 16,
      marginRight: 16,
      width: 100,
    },
    fileMessageBody: {
      width: "auto",
      display: "flex",
      alignItems: "center",
      marginLeft: 16,
      marginRight: 16,
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 8,
      paddingBottom: 8,
      fontSize: 14,
      backgroundColor: "#eee",
      color: theme.palette.text.primary,
      border: 1,
      borderRadius: 5,
      cursor: "pointer",
      textDecoration: "underline",
    },
  })
);

interface Props {
  profileUrl: string;
  message: SendBird.FileMessage;
  fromMe: boolean;
}

const FileMessage: React.FC<Props> = ({ profileUrl, message, fromMe }) => {
  const classes = useStyles();
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  const checkImage = (url: string) => {
    return (
      url.endsWith(".jpg") || url.endsWith(".png") || url.endsWith(".jpeg")
    );
  };

  return (
    <div>
      {!fromMe ? (
        <div className={classes.message}>
          <img alt="" src={profileUrl} width={40} height={40} />
          {checkImage(message.url) ? (
            <img
              src={message.url}
              className={classes.imageMessage}
              onClick={() => setImageDialogOpen(true)}
            />
          ) : (
            <div
              className={classes.fileMessageBody}
              onClick={() => openInNewTab(message.url)}
            >
              {message.name}
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            justifyContent: "flex-end",
          }}
          className={classes.message}
        >
          {checkImage(message.url) ? (
            <img
              src={message.url}
              className={classes.imageMessage}
              onClick={() => setImageDialogOpen(true)}
            />
          ) : (
            <div
              className={classes.fileMessageBody}
              onClick={() => openInNewTab(message.url)}
            >
              {message.name}
            </div>
          )}
          <img alt="" src={profileUrl} width={40} height={40} />
        </div>
      )}
      <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)}>
        <img
          src={message.url}
          style={{ height: "100%", width: "100%", objectFit: "contain" }}
        />
      </Dialog>
    </div>
  );
};

export { FileMessage };
