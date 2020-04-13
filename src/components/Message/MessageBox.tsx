import Button from "@material-ui/core/Button";
import Input, { InputProps } from "@material-ui/core/Input";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { AlertDialog, ResumeDialog } from "components/Util";
import { AlertType, ImageMimeType, FileMimeType } from "helpers";
import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { useInView } from "react-intersection-observer";
import {
  ChannelHandler,
  GroupChannel,
  Member,
  PreviousMessageListQuery,
  UserMessage,
} from "sendbird";
import { useAuth, useChannel } from "stores";
import { MessageList } from "./MessageList";
import { isGroupChannel, isUserMessage, SendBirdMessage } from "./utils";
import { Link } from "react-router-dom";
import { CommonWordsPopper } from "./CommonWordsPopper";
import ImageOutlinedIcon from "@material-ui/icons/ImageOutlined";
import AttachFileOutlinedIcon from "@material-ui/icons/AttachFileOutlined";
import { Job } from "@frankyjuang/milkapi-client";
import to from "await-to-js";
import Popper from "@material-ui/core/Popper";
import Typography from "@material-ui/core/Typography";
import Fade from "@material-ui/core/Fade";
import Paper from "@material-ui/core/Paper";
import { Slide } from "@material-ui/core";
import { PublicApplicantBasicInfo } from "components/Profile";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import moment from "moment";

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
      bottom: 0,
    },
    messages: {
      borderTop: "1px solid #EBEBEB",
      flex: 1,
      overflow: "auto",
    },
    messageInput: {
      padding: 8,
      borderTop: "1px solid #EBEBEB",
    },
    textField: {
      display: "flex",
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      flex: 1,
      border: 0,
    },
    jobContainer: {
      display: "flex",
      alignItems: "center",
      marginLeft: 16,
      paddingTop: 8,
      paddingBottom: 8,
    },
    jobName: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: 18,
      fontWeight: 800,
      color: "#484848",
      marginRight: 16,
      textDecoration: "none",
      cursor: "pointer",
    },
    jobSalary: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: 18,
      fontWeight: 400,
      marginRight: 16,
      color: "#FD8150",
    },
    location: {
      display: "flex",
      fontSize: 16,
      fontWeight: 400,
      marginRight: 16,
      color: "#484848",
      justifyContent: "center",
      alignItems: "center",
    },
    messageButton: {
      marginRight: 8,
    },
    jobHintContainer: {
      display: "flex",
      marginLeft: "auto",
      marginRight: 16,
    },
    jobHintTitle: {
      fontWeight: "bold",
      marginRight: 8,
    },
    jobHintLink: {
      color: theme.palette.secondary.main,
      textDecoration: "none",
    },
    resumeButtonDisabled: {
      borderWidth: 0.5,
      borderColor: theme.palette.text.hint,
      borderRadius: 8,
      borderStyle: "solid",
      color: theme.palette.text.hint,
      padding: 4,
      cursor: "pointer",
      marginLeft: 16,
    },
    resumeButton: {
      borderWidth: 0.5,
      borderColor: theme.palette.text.primary,
      borderRadius: 8,
      borderStyle: "solid",
      color: theme.palette.text.primary,
      padding: 4,
      cursor: "pointer",
      marginLeft: 16,
    },
    typography: {
      padding: theme.spacing(2),
    },
    backHeader: {
      display: "flex",
      flexDirection: "row",
      padding: 16,
      alignItems: "center",
      cursor: "pointer",
    },
    publicProfileContainer: {
      alignContent: "stretch",
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      overflow: "auto",
      paddingBottom: 40,
    },
  })
);

interface ResumeButtonProps {
  resumeKey?: string;
  channelUrl?: string;
}

const ResumeButton: React.FC<ResumeButtonProps> = ({
  resumeKey,
  channelUrl,
}) => {
  const classes = useStyles();
  const { getApi } = useAuth();
  const [mouseOver, setMouseOver] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string>();
  const [resumeOpen, setResumeOpen] = useState(false);

  const getResumeUrl = useCallback(async () => {
    if (resumeKey && channelUrl) {
      const channelApi = await getApi("Channel");
      const [, url] = await to(
        channelApi.getResumeUrlInChannel({
          resumeKey,
          channelUrl: channelUrl,
        })
      );
      setResumeUrl(url);
    }
  }, [getApi, resumeKey]);

  useEffect(() => {
    getResumeUrl();
  }, [getApi, resumeKey]);

  return resumeUrl ? (
    <>
      <div className={classes.resumeButton} onClick={() => setResumeOpen(true)}>
        履歷附件
      </div>
      <ResumeDialog
        isOpen={resumeOpen}
        close={() => setResumeOpen(false)}
        resumeUrl={resumeUrl}
      />
    </>
  ) : (
    <>
      <div
        className={classes.resumeButtonDisabled}
        onMouseEnter={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          setMouseOver(true);
          setAnchorEl(e.currentTarget);
        }}
        onMouseLeave={() => setMouseOver(false)}
      >
        履歷附件
      </div>
      <Popper open={mouseOver} anchorEl={anchorEl} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <Typography className={classes.typography}>
                求職者還沒有向你發送履歷，可以在訊息請對方傳履歷
              </Typography>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

interface Props {
  channelUrl: string;
  isRecruiter: boolean;
}

const MessageBox: React.FC<Props> = ({ channelUrl, isRecruiter }) => {
  const classes = useStyles();
  const { user, getApi } = useAuth();
  const { sb, addChannelHandler, removeChannelHandler } = useChannel();
  const [ref, inView] = useInView();
  const [input, setInput] = useState("");
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [channel, setChannel] = useState<GroupChannel>();
  const [they, setThey] = useState<Member>();
  const [scrollHeight, setScrollHeight] = useState(0);
  const [prevMessageListQuery, setPrevMessageListQuery] = useState<
    PreviousMessageListQuery
  >();
  const messages = useRef<(UserMessage | SendBird.FileMessage)[]>([]);
  const messagesEl = useRef<HTMLDivElement>(null);
  const theirLastSeenTime = useRef<number>();
  const [channelJobs, setChannelJobs] = useState<Job[]>([]);
  const [resumeKey, setResumeKey] = useState<string>();
  const [showPublicProfile, setShowPublicProfile] = useState(false);

  const loadPreviousMessages = (query: PreviousMessageListQuery) => {
    return new Promise<SendBirdMessage[]>((resolve, reject) => {
      query.load((msgs, error) => {
        error ? reject(error) : resolve(msgs);
      });
    });
  };

  const updateMetadata = ({
    channel,
    metadata,
  }: {
    channel: GroupChannel;
    metadata: any;
  }) => {
    return new Promise<any>((resolve, reject) => {
      channel.updateMetaData(metadata, true, (res, err) => {
        err ? reject(err) : resolve(res);
      });
    });
  };

  const sendFileMessage = async (file: File) => {
    if (channel) {
      const msg = await new Promise<SendBirdMessage>((resolve, reject) => {
        channel.sendFileMessage(file, (msg, error) => {
          error ? reject(error) : resolve(msg);
        });
      });
      isUserMessage(msg) && messages.current.unshift(msg);
      forceUpdate();
      if (messagesEl.current) {
        // scroll to bottom
        messagesEl.current.scrollTop =
          messagesEl.current.scrollHeight - messagesEl.current.offsetHeight;
      }
    }
  };

  const sendMessage = async (message: string) => {
    if (channel) {
      const msg = await new Promise<SendBirdMessage>((resolve, reject) => {
        channel.sendUserMessage(message, (msg, error) => {
          error ? reject(error) : resolve(msg);
        });
      });
      isUserMessage(msg) && messages.current.unshift(msg);
      forceUpdate();
      if (messagesEl.current) {
        // scroll to bottom
        messagesEl.current.scrollTop =
          messagesEl.current.scrollHeight - messagesEl.current.offsetHeight;
      }
    }
  };

  const onKeyDown: InputProps["onKeyDown"] = async (e) => {
    if (channel && e.keyCode === 13 && !e.shiftKey) {
      sendMessage(input);
      setInput("");
    }
  };

  useEffect(() => {
    const loadMoreMessages = async () => {
      if (
        inView &&
        prevMessageListQuery?.hasMore &&
        !prevMessageListQuery.isLoading
      ) {
        const fetchedMessages = await loadPreviousMessages(
          prevMessageListQuery
        );
        messages.current.push(...fetchedMessages.filter(isUserMessage));
        forceUpdate();

        if (messagesEl.current) {
          // keep scroll position
          messagesEl.current.scrollTop =
            messagesEl.current.scrollHeight - scrollHeight;
          setScrollHeight(messagesEl.current.scrollHeight);
        }
      }
    };

    loadMoreMessages();
  }, [inView, prevMessageListQuery, scrollHeight]);

  const sendResume = async () => {
    if (!sb || !channel) {
      return;
    }
    if (!user?.profile?.resumeKey) {
      setResumeDialogOpen(true);
      return;
    }

    const params = new sb.UserMessageParams();
    params.customType = "resume";
    params.data = JSON.stringify({ resumeKey: user.profile.resumeKey });
    params.message = "履歷";
    const msg = await new Promise<SendBirdMessage>((resolve, reject) => {
      channel.sendUserMessage(params, (msg, error) => {
        error ? reject(error) : resolve(msg);
      });
    });
    isUserMessage(msg) && messages.current.unshift(msg);
    forceUpdate();

    // Update resume meta data
    await updateMetadata({
      channel,
      metadata: {
        resumeKey: user.profile.resumeKey,
      },
    });

    if (messagesEl.current) {
      // scroll to bottom
      messagesEl.current.scrollTop =
        messagesEl.current.scrollHeight - messagesEl.current.offsetHeight;
    }
  };

  const getTheirLastSeenTime = useCallback(
    (ch: GroupChannel) => {
      if (they && ch.url === channelUrl) {
        const readStatus = ch.getReadStatus();
        if (they.userId in readStatus && readStatus[they.userId]) {
          theirLastSeenTime.current = readStatus[they.userId].last_seen_at;
          forceUpdate();
        }
      }
    },
    [channelUrl, they]
  );

  const onMessageReceived: ChannelHandler["onMessageReceived"] = useCallback(
    (ch, msg) => {
      if (!isGroupChannel(ch)) {
        return;
      }

      if (channel && ch.url === channel.url) {
        ch.markAsRead();
        isUserMessage(msg) && messages.current.unshift(msg);
        forceUpdate();
        if (messagesEl.current) {
          // scroll to bottom
          messagesEl.current.scrollTop =
            messagesEl.current.scrollHeight - messagesEl.current.offsetHeight;
        }
      }
    },
    [channel]
  );

  useEffect(() => {
    let handlerId: string | undefined;

    if (sb) {
      // Register onChannelChanged listener.
      const handler = new sb.ChannelHandler();
      handler.onMessageReceived = onMessageReceived;
      handler.onReadReceiptUpdated = getTheirLastSeenTime;
      handlerId = addChannelHandler(handler);
    }

    return () => {
      handlerId && removeChannelHandler(handlerId);
    };
  }, [
    addChannelHandler,
    getTheirLastSeenTime,
    onMessageReceived,
    removeChannelHandler,
    sb,
  ]);

  const getChannelMetaData = () => {
    async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }
    channel &&
      channel.getMetaData([], async (res, err) => {
        const jobApi = await getApi("Job");
        const jobIds: string[] = [];
        const fetchedChannelJobs: Job[] = [];
        Object.keys(res).map(async (k) => {
          if (res[k] === "job") {
            jobIds.push(k);
          }
          if (k === "resumeKey") setResumeKey(res[k]);
        });
        await asyncForEach(jobIds, async (id) => {
          const [err, job] = await to(jobApi.getJobAnonymously({ jobId: id }));
          job && fetchedChannelJobs.push(job);
        });
        setChannelJobs(fetchedChannelJobs);
      });
  };

  useEffect(() => {
    user &&
      channel &&
      setThey(channel.members.find((m) => m.userId !== user.uuid));
    user && channel && getChannelMetaData();
  }, [channel, user]);

  useEffect(() => {
    const init = async () => {
      if (!sb) {
        return;
      }

      const ch = await new Promise<GroupChannel>((resolve, reject) => {
        sb.GroupChannel.getChannel(channelUrl, (ch, error) => {
          error ? reject(error) : resolve(ch);
        });
      });
      setChannel(ch);

      const query = ch.createPreviousMessageListQuery();
      query.limit = 20;
      query.reverse = true;
      setPrevMessageListQuery(query);
      const previousMessages = await loadPreviousMessages(query);
      messages.current = previousMessages.filter(isUserMessage);
      forceUpdate();

      getTheirLastSeenTime(ch);
      ch.markAsRead();

      if (messagesEl.current) {
        // scroll to bottom
        setScrollHeight(messagesEl.current.scrollHeight);
        messagesEl.current.scrollTop =
          messagesEl.current.scrollHeight - messagesEl.current.offsetHeight;
      }
    };

    init();
  }, [channelUrl, getTheirLastSeenTime, sb]);

  return (
    <>
      <Slide
        direction="left"
        in={showPublicProfile}
        mountOnEnter
        unmountOnExit
        style={{ backgroundColor: "white" }}
      >
        <div className={classes.container}>
          <div
            className={classes.backHeader}
            onClick={() => setShowPublicProfile(false)}
          >
            <ArrowBackIosIcon />
            <div>返回</div>
          </div>
          <div className={classes.publicProfileContainer}>
            {they && <PublicApplicantBasicInfo userId={they?.userId} />}
          </div>
        </div>
      </Slide>
      <div
        className={classes.container}
        style={{ visibility: showPublicProfile ? "hidden" : "visible" }}
      >
        <AlertDialog
          isOpen={resumeDialogOpen}
          close={() => setResumeDialogOpen(false)}
          type={AlertType.NoResume}
        />
        <div className={classes.jobContainer}>
          <div
            className={classes.jobName}
            onClick={() => setShowPublicProfile(true)}
          >
            {they?.nickname || ""}
          </div>
          <div>
            {they &&
              (they.connectionStatus === "online"
                ? "上線中"
                : moment(new Date(they.lastSeenAt)).fromNow())}
          </div>
          {/* </Link> */}
          {isRecruiter && (
            <ResumeButton resumeKey={resumeKey} channelUrl={channel?.url} />
          )}
          {channelJobs.length > 0 && (
            <div className={classes.jobHintContainer}>
              <div className={classes.jobHintTitle}>{"詢問職缺 :"}</div>
              <Link
                to={"/job/" + channelJobs[0].uuid}
                className={classes.jobHintLink}
                target="_blank"
              >
                {channelJobs[0].name}
              </Link>
            </div>
          )}
        </div>
        <div className={classes.messages} ref={messagesEl}>
          <div ref={ref}></div>
          <MessageList
            messages={messages.current}
            userId={user?.uuid || ""}
            theirLastSeenTime={theirLastSeenTime}
            channel={channel}
          />
        </div>
        <div className={classes.messageInput}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: 8,
              marginTop: 4,
              marginBottom: 6,
            }}
          >
            {!isRecruiter && (
              <Button onClick={sendResume} className={classes.messageButton}>
                發送履歷
              </Button>
            )}
            <CommonWordsPopper sendMessage={sendMessage} />
            <label style={{ marginLeft: 8, marginRight: 8, cursor: "pointer" }}>
              <input
                hidden
                accept={ImageMimeType}
                onChange={(e) => {
                  e.target.files && sendFileMessage(e.target.files[0]);
                }}
                type="file"
              />
              <ImageOutlinedIcon />
            </label>
            <label style={{ marginLeft: 8, marginRight: 8, cursor: "pointer" }}>
              <input
                hidden
                accept={FileMimeType}
                onChange={(e) => {
                  e.target.files && sendFileMessage(e.target.files[0]);
                }}
                type="file"
              />
              <AttachFileOutlinedIcon />
            </label>
          </div>
          <Input
            autoFocus
            className={classes.textField}
            disableUnderline={true}
            placeholder="Enter 鍵送出訊息"
            multiline
            onChange={(e) =>
              e.target.value !== "\n" && setInput(e.target.value)
            }
            onKeyDown={onKeyDown}
            rows="4"
            value={input}
          />
        </div>
      </div>
    </>
  );
};

export { MessageBox };
