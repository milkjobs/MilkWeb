import React, { useState, useRef } from "react";
import { createStyles, Theme } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import { makeStyles } from "@material-ui/core/styles";
import { Messages } from "components/Message";
import { useAuth } from "stores";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flex: 1,
      flexDirection: "column",
      borderTop: "1px solid #EBEBEB",
      borderRight: "1px solid #EBEBEB",
      borderBottom: "1px solid #EBEBEB",
      overflow: "hidden",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    },
    messages: {
      borderTop: "1px solid #EBEBEB",
      flex: 1,
      overflow: "auto"
    },
    messageInput: {
      position: "fixed",
      width: "100%",
      bottom: 0,
      zIndex: 100,
      borderTop: "1px solid #EBEBEB"
    },
    textField: {
      display: "flex",
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      flex: 1,
      border: 0
    },
    jobContainer: {
      display: "flex",
      marginLeft: 16,
      paddingTop: 8,
      paddingBottom: 8
    },
    jobName: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: 18,
      fontWeight: 800,
      color: "#484848",
      marginRight: 16
    },
    jobSalary: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: 18,
      fontWeight: 400,
      marginRight: 16,
      color: "#FD8150"
    },
    location: {
      display: "flex",
      fontSize: 16,
      fontWeight: 400,
      marginRight: 16,
      color: "#484848",
      justifyContent: "center",
      alignItems: "center"
    }
  })
);

const SampleMessageBox: React.FC = () => {
  const classes = useStyles();

  const { userId } = useAuth();

  const [input, setInput] = useState("");
  const messages = useRef<any>([
    {
      message: "好的，請問你何時可以來應徵",
      sender: {
        profileUrl:
          "https://milkjobs-teams-production.s3.amazonaws.com/fa7e298aa1924bc89a1e1eeb7012ad6c.jpg",
        userId: null
      },
      requestState: "succeeded"
    },
    {
      message: "你好，我想應徵業務的工作",
      sender: {
        profileUrl:
          "https://milkjobs-users-production.s3.amazonaws.com/default-profiles/profile22.png",
        userId: undefined
      },
      requestState: "succeeded"
    }
  ]);
  const messagesEl = useRef<any>(null);

  const keyPress = async e => {
    if (e.keyCode === 13) {
      const text = e.target.value.replace(/(\r\n|\n|\r)/gm, "");
      messages.current = [
        {
          message: text,
          sender: {
            profileUrl:
              "https://milkjobs-users-production.s3.amazonaws.com/default-profiles/profile22.png",
            userId: undefined
          },
          requestState: "succeeded"
        }
      ].concat(messages.current);
      setInput("");
      // scroll to bottom
      messagesEl.current.scrollTop =
        messagesEl.current.scrollHeight - messagesEl.current.offsetHeight;
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.jobContainer}>
        <div className={classes.jobName}>牛奶找工作（聊天功能體驗版）</div>
      </div>
      <div
        className={classes.messages}
        ref={el => {
          messagesEl.current = el;
        }}
      >
        <Messages messages={messages.current} userId={userId!} />
      </div>
      <div className={classes.messageInput}>
        {/* <div style={{ display: "flex", marginLeft: 8, marginTop: 4 }}>
          <Button onClick={() => {}}>發送履歷</Button>
        </div> */}
        <Input
          value={input}
          id="standard-multiline-static"
          multiline
          rows="4"
          onChange={e => e.target.value !== "\n" && setInput(e.target.value)}
          className={classes.textField}
          onKeyDown={keyPress}
          disableUnderline={true}
        />
      </div>
    </div>
  );
};

export { SampleMessageBox };
