import React, { useState, useEffect } from "react";
import { createStyles, Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import { MessageCustomType } from "@frankyjuang/milkapi-client";
import { useAuth } from "stores";
import to from "await-to-js";
import { ResumeDialog } from "components/Util";
import { ApplicationMessage } from "./applicationMessage";

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
      fontSize: 14,
      backgroundColor: "#eee",
      border: 1,
      borderRadius: 5
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

const Message: React.FC<Props> = props => {
  // Was the message sent by the current user. If so, add a css class
  const classes = useStyles();
  const { getApi } = useAuth();
  const { fromMe } = props;
  const [resumeUrl, setResumeUrl] = useState<string>();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  const getResumeUrl = async () => {
    const data = JSON.parse(props.message.data);
    const channelApi = await getApi("Channel");
    const [err, url] = await to(
      channelApi.getResumeUrlInChannel({
        resumeKey: data["resumeKey"],
        channelUrl: props.message.channelUrl
      })
    );
    setResumeUrl(url);
  };

  useEffect(() => {
    if (props.message.customType === MessageCustomType.Resume) {
      getResumeUrl();
    }
  }, []);

  if (props.message.customType === MessageCustomType.Application) {
    return <ApplicationMessage {...props} />;
  }

  if (props.message.customType === MessageCustomType.Resume) {
    return !fromMe ? (
      <div className={classes.message}>
        <img alt="" src={props.profileUrl} width={40} height={40} />
        <div onClick={handleOpen} className={classes.resumeMessageBody}>
          {props.message.message}
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
          {props.message.message}
        </div>
        <img alt="" src={props.profileUrl} width={40} height={40} />
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
      <img alt="" src={props.profileUrl} width={40} height={40} />
      <div className={classes.messageBody}>{props.message.message}</div>
    </div>
  ) : (
    <div
      style={{
        justifyContent: "flex-end"
      }}
      className={classes.message}
    >
      <div className={classes.messageBody}>{props.message.message}</div>
      <img alt="" src={props.profileUrl} width={40} height={40} />
    </div>
  );
};

interface Props {
  profileUrl: string;
  message: SendBird.UserMessage;
  fromMe: boolean;
}

export { Message };
