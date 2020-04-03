import { Bottle as BottleType, BottleReply } from "@frankyjuang/milkapi-client";
import { makeStyles } from "@material-ui/core/styles";
import { Header } from "components/Header";
import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "stores";
import { Bottle, PlusBottle } from "components/Bottle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import { LoginDialog } from "components/Util";
import { TextField, Button } from "@material-ui/core";
import to from "await-to-js";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import { SmsOutlined, Sms } from "@material-ui/icons";
import { useHistory, useParams } from "react-router-dom";
import { DownloadApp } from "components/Util";

const useStyles = makeStyles(theme => ({
  containerHeader: {
    display: "flex",
    flexDirection: "row",
    alignContent: "stretch",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    width: 600,
    [theme.breakpoints.down("xs")]: {
      width: "100%"
    }
  },
  myBottle: {
    fontSize: 18
  },
  message: {
    fontSize: 18,
    marginBottom: 32
  },
  reply: {
    fontSize: 18,
    marginBottom: 32,
    padding: 16,
    borderRadius: 4,
    backgroundColor: theme.palette.action.hover
  },
  time: {
    fontSize: 14,
    color: theme.palette.text.hint
  },
  replyMessageContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  container: {
    alignContent: "stretch",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    flexGrow: 1,
    marginBottom: 30,
    marginLeft: "auto",
    marginRight: "auto",
    width: 600,
    [theme.breakpoints.down("xs")]: {
      width: "100%"
    }
  },
  bottle: {
    width: 200,
    cursor: "pointer",
    [theme.breakpoints.down("xs")]: {
      width: "33%"
    }
  },
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper
  },
  dialogPaper: {
    minHeight: "35vh"
  },
  loading: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "auto",
    marginBottom: "auto"
  }
}));

interface CreateDialogProps {
  open: boolean;
  onClose: () => void;
  addBottle: (bottle: BottleType) => void;
}

const CreateDialog: React.FC<CreateDialogProps> = props => {
  const classes = useStyles();
  const { user, getApi } = useAuth();
  const { onClose, open, addBottle } = props;
  const [message, setMessage] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  const showLoginDialog = () => {
    setIsLoginDialogOpen(true);
  };

  const hideLoginDialog = () => {
    setIsLoginDialogOpen(false);
  };

  const handleClose = () => {
    onClose();
  };

  const send = useCallback(async () => {
    if (!message || !user) {
      return;
    }

    setLoading(true);

    const bottleApi = await getApi("Bottle");
    const newBottle = await bottleApi.addBottle({
      userId: user.uuid,
      newBottle: { message }
    });
    addBottle(newBottle);
    setLoading(false);
    handleClose();
  }, [user, getApi, message]);

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
      fullWidth
    >
      <DialogTitle id="simple-dialog-title">寫一個牛奶瓶</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          placeholder={"寫下你的心情"}
          id="introduction"
          margin="normal"
          multiline
          onChange={e => setMessage(e.target.value)}
          rows="8"
          value={message}
        />
      </DialogContent>
      {
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            取消
          </Button>
          <Button
            onClick={user ? send : showLoginDialog}
            color="primary"
            autoFocus
          >
            送出
          </Button>
          <LoginDialog isOpen={isLoginDialogOpen} close={hideLoginDialog} />
        </DialogActions>
      }
    </Dialog>
  );
};

interface ReplyDialogProps {
  open: boolean;
  bottle: BottleType;
  onClose: () => void;
  myBottle: boolean;
}

const ReplyDialog: React.FC<ReplyDialogProps> = props => {
  const classes = useStyles();
  const { user, getApi } = useAuth();
  const history = useHistory();
  const { onClose, open, bottle: b, myBottle } = props;
  const [reply, setReply] = useState<string>();
  const [bottle, setBottle] = useState(b);
  const [loading, setLoading] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  const showLoginDialog = () => {
    setIsLoginDialogOpen(true);
  };

  const hideLoginDialog = () => {
    setIsLoginDialogOpen(false);
  };

  const handleClose = () => {
    onClose();
  };

  const replyBottle = async () => {
    if (!user || !reply) {
      return;
    }

    setLoading(true);
    const bottleApi = await getApi("Bottle");
    const [err] = await to(
      bottleApi.addBottleReply({
        bottleId: bottle.uuid,
        newBottleReply: { replierId: user.uuid, message: reply }
      })
    );
    setLoading(false);
    handleClose();
  };

  const getBottle = useCallback(async () => {
    setLoading(true);
    const bottleApi = await getApi("Bottle");
    const [err, fetchedBottle] = await to(
      bottleApi.getBottle({ bottleId: b.uuid })
    );
    console.warn(fetchedBottle);
    fetchedBottle && setBottle(fetchedBottle);
    setLoading(false);
  }, [b, getApi, user]);

  useEffect(() => {
    getBottle();
    setBottle(b);
    setReply(undefined);
  }, [b, user]);

  const match = async (reply: BottleReply, bottleId: string) => {
    if (reply.channelUrl) {
      history.push("/message/" + reply.channelUrl);

      return;
    }

    setLoading(true);
    const bottleApi = await getApi("Bottle");
    const [err, updatedReply] = await to(
      bottleApi.matchBottle({ bottleId, replyId: reply.uuid })
    );
    setLoading(false);
    !err && getBottle();
    updatedReply?.channelUrl &&
      history.push("/message/" + updatedReply.channelUrl);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
      fullWidth
      classes={{ paper: classes.dialogPaper }}
    >
      {loading ? (
        <CircularProgress className={classes.loading} />
      ) : (
        <DialogContent>
          <div className={classes.message}>
            {bottle.message.split("\n").map((m, index) => (
              <div key={index}>{m}</div>
            ))}
            <div className={classes.time}>
              {bottle.createdAt.toLocaleString()}
            </div>
          </div>
          {bottle.replies?.length || myBottle ? (
            bottle.replies?.length ? (
              bottle.replies.map(r => (
                <div key={r.uuid} className={classes.reply}>
                  <div className={classes.replyMessageContainer}>
                    <div>{r.message}</div>
                    {myBottle &&
                      (r.channelUrl ? (
                        <Sms onClick={() => match(r, bottle.uuid)} />
                      ) : (
                        <SmsOutlined onClick={() => match(r, bottle.uuid)} />
                      ))}
                  </div>
                  <div className={classes.time}>
                    {r.repliedAt.toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div className={classes.reply}>等待遙遠的回覆</div>
            )
          ) : (
            <TextField
              fullWidth
              placeholder={"回覆對方的心情"}
              id="introduction"
              margin="normal"
              multiline
              onChange={e => setReply(e.target.value)}
              rows="8"
              value={reply}
            />
          )}
        </DialogContent>
      )}
      {!loading && !bottle.replies?.length && !myBottle && (
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            取消
          </Button>
          <Button
            onClick={user ? replyBottle : showLoginDialog}
            color="primary"
            autoFocus
          >
            回覆
          </Button>
          <LoginDialog isOpen={isLoginDialogOpen} close={hideLoginDialog} />
        </DialogActions>
      )}
    </Dialog>
  );
};

const Bottles: React.FC = () => {
  const classes = useStyles();
  const { getApi, user } = useAuth();
  const params = useParams<{ id: string }>();
  const [bottles, setBottles] = useState<BottleType[]>([]);
  const [myBottles, setMyBottles] = useState<BottleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [replyOpen, setReplyOpen] = useState(params.id ? true : false);
  const [selectedBottle, setSelectedBottle] = useState<BottleType | undefined>(
    params.id
      ? ({
          uuid: params.id,
          message: "",
          createdAt: new Date(),
          expiresAt: new Date(),
          replies: [],
          replyCount: 0
        } as BottleType)
      : undefined
  );
  const [checked, setChecked] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const pageSize = 50;

  const unique = (data: BottleType[]) => {
    const seen = new Set<string>();
    return data.filter(b => {
      const k = b.uuid;
      return seen.has(k) ? false : seen.add(k);
    });
  };

  const getBottles = useCallback(
    async (page: number) => {
      setLoading(true);
      const bottleApi = await getApi("Bottle");
      const response = await bottleApi.getBottlesRaw({
        pageNo: page,
        pageSize
      });
      const totalPages = response.raw.headers.get("X-Total-Pages");
      const fetchedBottles = await response.value();

      let hasMore = true;
      if (fetchedBottles.length < pageSize) {
        hasMore = false;
      } else if (totalPages && page >= parseInt(totalPages, 10)) {
        hasMore = false;
      }
      setLoading(false);

      return { fetchedBottles, hasMore };
    },
    [getApi]
  );
  const init = async () => {
    const { fetchedBottles, hasMore } = await getBottles(pageNo);
    setBottles(prev => unique([...prev, ...fetchedBottles]));
    setHasMorePages(hasMore);
    setPageNo(x => x + 1);

    let myPageNo = 1;
    const myPageSize = 20;
    const userApi = await getApi("User");
    let latestBottles: BottleType[] = [];

    while (user) {
      const response = await userApi.getUserBottlesRaw({
        userId: user.uuid,
        pageNo: myPageNo,
        pageSize: myPageSize
      });
      const totalPages = response.raw.headers.get("X-Total-Pages");
      const fetchedBottles = await response.value();

      if (!fetchedBottles.length) {
        break;
      }

      latestBottles = [...latestBottles, ...fetchedBottles];
      if (totalPages && myPageNo >= parseInt(totalPages, 10)) {
        break;
      }

      myPageNo += 1;
    }

    setMyBottles(latestBottles);
  };

  useEffect(() => {
    init();
  }, [user]);

  return (
    <div className={classes.root}>
      <Header />
      <div>
        {user && (
          <div className={classes.containerHeader}>
            <Checkbox
              checked={checked}
              onChange={handleChange}
              inputProps={{ "aria-label": "primary checkbox" }}
            />
            <div className={classes.myBottle}>自己的瓶子</div>
          </div>
        )}
        <div className={classes.container}>
          <div className={classes.bottle} onClick={() => setCreateOpen(true)}>
            <PlusBottle />
          </div>
          {(checked ? myBottles : bottles).map(b => (
            <div
              key={b.uuid}
              className={classes.bottle}
              onClick={() => {
                setSelectedBottle(b);
                setReplyOpen(true);
              }}
            >
              <Bottle
                bottle={b}
                myBottle={Boolean(myBottles.find(mb => mb.uuid === b.uuid))}
              />
            </div>
          ))}
        </div>
      </div>
      <CreateDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        addBottle={(b: BottleType) => {
          setBottles([b, ...bottles]);
          setMyBottles([b, ...myBottles]);
        }}
      />
      {selectedBottle && (
        <ReplyDialog
          myBottle={Boolean(
            myBottles.find(b => b.uuid === selectedBottle.uuid)
          )}
          open={replyOpen}
          onClose={() => setReplyOpen(false)}
          bottle={selectedBottle}
        />
      )}
      <Button
        style={{ marginBottom: 64 }}
        onClick={() => setDownloadDialogOpen(true)}
      >
        {"想看更多的牛奶瓶？下載牛奶找工作 App"}
      </Button>
      <DownloadApp
        isOpen={downloadDialogOpen}
        close={() => setDownloadDialogOpen(false)}
      />
    </div>
  );
};

export default Bottles;
