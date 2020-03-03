import { MessageCustomType } from "@frankyjuang/milkapi-client";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import to from "await-to-js";
import { ResumeDialog } from "components/Util";
import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "stores";
import { ApplicationMessage } from ".";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    message: {
      margin: 16,
      display: "flex"
    },
    messageBody: {
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
      maxWidth: "60%"
    },
    resumeMessageBody: {
      width: "auto",
      display: "flex",
      alignItems: "center",
      marginLeft: 16,
      marginRight: 16,
      paddingLeft: 16,
      paddingRight: 16,
      fontSize: 14,
      backgroundColor: "#eee",
      color: theme.palette.text.primary,
      border: 1,
      borderRadius: 5,
      cursor: "pointer",
      textDecoration: "underline"
    }
  })
);

interface Props {
  profileUrl: string;
  message: SendBird.UserMessage;
  fromMe: boolean;
}

const Message: React.FC<Props> = props => {
  // Was the message sent by the current user. If so, add a css class
  const classes = useStyles();
  const { getApi } = useAuth();
  const { fromMe, profileUrl, message } = props;
  const [resumeUrl, setResumeUrl] = useState<string>();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  const getResumeUrl = useCallback(async () => {
    const data = JSON.parse(message.data);
    const channelApi = await getApi("Channel");
    const [, url] = await to(
      channelApi.getResumeUrlInChannel({
        resumeKey: data["resumeKey"],
        channelUrl: message.channelUrl
      })
    );
    setResumeUrl(url);
  }, [getApi, message.channelUrl, message.data]);

  useEffect(() => {
    if (message.customType === MessageCustomType.Resume) {
      getResumeUrl();
    }
  }, [getResumeUrl, message.customType]);

  if (message.customType === MessageCustomType.Application) {
    return <ApplicationMessage {...props} />;
  }

  if (message.customType === MessageCustomType.Resume) {
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
          justifyContent: "flex-end"
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

  return !fromMe ? (
    <div className={classes.message}>
      <img alt="" src={profileUrl} width={40} height={40} />
      <div className={classes.messageBody}>{message.message}</div>
    </div>
  ) : (
    <div
      style={{
        justifyContent: "flex-end"
      }}
      className={classes.message}
    >
      <div className={classes.messageBody} style={{ textAlign: "right" }}>
        {message.message}
      </div>
      <img alt="" src={profileUrl} width={40} height={40} />
    </div>
  );
};

export { Message };
