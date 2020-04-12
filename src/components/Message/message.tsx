import {
  MessageCustomType,
  SystemMessageCustomType,
} from "@frankyjuang/milkapi-client";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import to from "await-to-js";
import { ResumeDialog } from "components/Util";
import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "stores";
import { ApplicationMessage, FileMessage, TextMessage } from ".";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    message: {
      margin: 16,
      display: "flex",
      alignItems: "center",
    },
    messageBody: {
      textDecoration: "none",
      color: theme.palette.text.primary,
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
      border: 1,
      borderRadius: 5,
      textAlign: "left",
      overflowWrap: "anywhere",
      maxWidth: "60%",
      whiteSpace: "pre",
    },
    resumeMessageBody: {
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
    imageMessage: {
      marginLeft: 16,
      marginRight: 16,
      width: 100,
    },
  })
);

interface Props {
  profileUrl: string;
  message: SendBird.UserMessage | SendBird.FileMessage;
  fromMe: boolean;
  channel?: SendBird.GroupChannel;
}

const Message: React.FC<Props> = (props) => {
  // Was the message sent by the current user. If so, add a css class
  const classes = useStyles();
  const { getApi } = useAuth();
  const { fromMe, profileUrl, message, channel } = props;
  const [resumeUrl, setResumeUrl] = useState<string>();
  const [postId, setPostId] = useState<string>();
  const [bottleId, setBottleId] = useState<string>();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  const getBottleId = useCallback(async () => {
    const data = JSON.parse(message.data);
    setBottleId(data["bottleId"]);
  }, [getApi, message.channelUrl, message.data]);

  const getPostId = useCallback(async () => {
    const data = JSON.parse(message.data);
    setPostId(data["postId"]);
  }, [getApi, message.channelUrl, message.data]);

  const getResumeUrl = useCallback(async () => {
    const data = JSON.parse(message.data);
    const channelApi = await getApi("Channel");
    const [, url] = await to(
      channelApi.getResumeUrlInChannel({
        resumeKey: data["resumeKey"],
        channelUrl: message.channelUrl,
      })
    );
    setResumeUrl(url);
  }, [getApi, message.channelUrl, message.data]);

  useEffect(() => {
    if (message.customType === MessageCustomType.Resume) {
      getResumeUrl();
    }
    if (message.customType === SystemMessageCustomType.PostReply) {
      getPostId();
    }
    if (message.customType === SystemMessageCustomType.BottleReply) {
      getBottleId();
    }
  }, [getResumeUrl, getPostId, getBottleId, message.customType]);

  if (
    message.customType === MessageCustomType.Application &&
    "message" in message
  ) {
    return (
      <ApplicationMessage
        fromMe={fromMe}
        profileUrl={profileUrl}
        message={message}
      />
    );
  }

  if (message.customType === MessageCustomType.Resume && "message" in message) {
    return !fromMe ? (
      <div className={classes.message}>
        <img alt="" src={profileUrl} width={40} height={40} />
        <div onClick={handleOpen} className={classes.resumeMessageBody}>
          {message.message}
        </div>
        <ResumeDialog
          isOpen={isOpen}
          close={handleClose}
          resumeUrl={resumeUrl}
        />
      </div>
    ) : (
      <div
        style={{
          justifyContent: "flex-end",
        }}
        className={classes.message}
      >
        <div onClick={handleOpen} className={classes.resumeMessageBody}>
          {message.message}
        </div>
        <img alt="" src={profileUrl} width={40} height={40} />
        <ResumeDialog
          isOpen={isOpen}
          close={handleClose}
          resumeUrl={resumeUrl}
        />
      </div>
    );
  }

  if (
    message.customType === SystemMessageCustomType.BottleReply &&
    "message" in message &&
    bottleId
  ) {
    return !fromMe ? (
      <div className={classes.message}>
        <img alt="" src={profileUrl} width={40} height={40} />
        <Link to={"/bottle/" + bottleId} className={classes.messageBody}>
          {message.message}
        </Link>
      </div>
    ) : (
      <div
        style={{
          justifyContent: "flex-end",
        }}
        className={classes.message}
      >
        <div className={classes.messageBody} style={{ textAlign: "right" }}>
          {message.message}
        </div>
        <img alt="" src={profileUrl} width={40} height={40} />
      </div>
    );
  }

  if (
    message.customType === SystemMessageCustomType.PostReply &&
    "message" in message &&
    postId
  ) {
    return !fromMe ? (
      <div className={classes.message}>
        <img alt="" src={profileUrl} width={40} height={40} />
        <Link to={"/circle/" + postId} className={classes.messageBody}>
          {message.message}
        </Link>
      </div>
    ) : (
      <div
        style={{
          justifyContent: "flex-end",
        }}
        className={classes.message}
      >
        <div className={classes.messageBody} style={{ textAlign: "right" }}>
          {message.message}
        </div>
        <img alt="" src={profileUrl} width={40} height={40} />
      </div>
    );
  }

  if ("message" in message)
    return (
      <TextMessage
        fromMe={fromMe}
        profileUrl={profileUrl}
        message={message}
        channel={channel}
      />
    );
  return (
    <FileMessage fromMe={fromMe} profileUrl={profileUrl} message={message} />
  );
};

export { Message };
