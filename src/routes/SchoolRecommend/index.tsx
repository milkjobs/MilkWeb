import { AwesomeList, AwesomeTeam } from "@frankyjuang/milkapi-client";
import { useMediaQuery } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import TextField from "@material-ui/core/TextField";
import { AwesomeHeader } from "components/Awesome";
import { Header } from "components/Header";
import "firebase/analytics";
import firebase from "firebase/app";
import { checkUrl, openInNewTab, PageMetadata } from "helpers";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sticky from "react-stickynode";
import { useAuth } from "stores";
import chat from "tlk";

const useStyles = makeStyles(theme => ({
  root: {
    height: "100vh",
    backgroundColor: theme.palette.background.paper
  },
  container: {
    flex: 3,
    marginTop: 20,
    marginBottom: 20,
    display: "flex",
    paddingRight: 48,
    paddingLeft: 48,
    flexDirection: "column",
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up("md")]: {
      width: "960px"
    },
    [theme.breakpoints.down("xs")]: {
      marginRight: "auto",
      marginLeft: "auto",
      marginTop: 8,
      marginBottom: 8,
      paddingRight: 24,
      paddingLeft: 24
    }
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  header: {
    fontSize: 20,
    textAlign: "left",
    [theme.breakpoints.down("xs")]: {
      fontSize: 16
    },
    fontWeight: 800,
    margin: "16px 0"
  },
  companyCardContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    [theme.breakpoints.down("xs")]: {
      padding: 8
    },
    "&:hover": {
      cursor: "pointer",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1) !important"
    },
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: theme.palette.divider,
    backgroundColor: theme.palette.background.paper
  },
  nameContainer: {
    display: "flex",
    marginLeft: 16,
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0
    },
    flexDirection: "column"
  },
  logo: {
    maxWidth: 100,
    height: 100,
    [theme.breakpoints.down("xs")]: {
      maxWidth: 40,
      height: 40
    },
    margin: 16,
    objectFit: "contain"
  },
  title: {
    fontSize: 24,
    textAlign: "left",
    [theme.breakpoints.down("xs")]: {
      marginLeft: 8
    }
  },
  info: {
    fontSize: 16,
    color: theme.palette.text.secondary,
    textAlign: "left",
    [theme.breakpoints.down("xs")]: {
      marginLeft: 8
    }
  },
  description: {
    marginTop: 16,
    fontSize: 18,
    [theme.breakpoints.down("xs")]: {
      fontSize: 16,
      marginTop: 0
    },
    textAlign: "left"
  },
  iconContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  chatRoom: {
    flex: 1,
    paddingLeft: 40,
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  }
}));

const CompanyCard: React.FC<AwesomeTeam> = props => {
  const classes = useStyles();
  const matched = useMediaQuery((theme: Theme) => theme.breakpoints.down("xs"));

  const sizeToWord = (size: number) => {
    if (size >= 10000) return ` ${size / 10000} 萬人`;
    else return ` ${size} 人`;
  };

  const incomeToWord = (income: number) => {
    if (income >= 10000) return `營收約 ${income / 10000} 兆新台幣`;
    else return `營收約 ${income} 億新台幣`;
  };

  const linkedinCountToWord = (count: number) => {
    return `統計: ${count} 人`;
  };

  return (
    <div
      className={classes.companyCardContainer}
      onClick={() => openInNewTab(checkUrl(props.website))}
    >
      {!matched && (
        <img alt="team logo" src={props.logoUrl} className={classes.logo} />
      )}
      <div className={classes.nameContainer}>
        <div className={classes.iconContainer}>
          {matched && (
            <img alt="team logo" src={props.logoUrl} className={classes.logo} />
          )}
          <div>
            <div className={classes.title}>{props.name}</div>
            <div className={classes.info}>
              {`${props.field ? props.field : ""} ${
                props.headcount ? sizeToWord(props.headcount) : ""
              }   ${
                props.revenue && !matched ? incomeToWord(props.revenue) : ""
              }   ${
                props.linkedinCount
                  ? linkedinCountToWord(props.linkedinCount)
                  : ""
              }`}
            </div>
          </div>
        </div>
        <div className={classes.description}>{props.introduction}</div>
      </div>
    </div>
  );
};

const useTabsStyles = makeStyles(theme => ({
  root: {
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: theme.palette.divider,
    paddingLeft: 24,
    paddingRight: 24
  },
  indicator: {
    backgroundColor: theme.palette.text.primary
  }
}));

const useTabStyles = makeStyles(theme => ({
  root: {
    textTransform: "none",
    color: theme.palette.grey["500"],
    minWidth: 72,
    fontSize: 16,
    [theme.breakpoints.down("xs")]: {
      fontSize: 14
    },
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(","),
    "&:hover": {
      color: theme.palette.secondary.main,
      opacity: 1
    },
    "&$selected": {
      color: theme.palette.text.primary
    }
  },
  selected: {}
}));

const Awesome: React.FC = () => {
  const { getApi, user } = useAuth();
  const params = useParams<{ name: string }>();
  const classes = useStyles();
  const [awesomeList, setAwesomeList] = useState<AwesomeList[]>();
  const [open, setOpen] = useState(false);
  const [suggestion, setSuggestion] = useState<string>();
  const tabsStyle = useTabsStyles();
  const tabStyle = useTabStyles();
  const [value, setValue] = useState(0);
  const [note, setNote] = useState<string>(localStorage.getItem("note") || "");
  const [helperText, setHelperText] = useState<string>();
  const introduction = `為了幫助學生更了解自己有哪些選擇，我們整理了${params.name}畢業生最常去的公司。先從這些公司開始應徵吧！`;

  const saveNote = (note: string) => {
    // eslint-disable-next-line @typescript-eslint/camelcase
    firebase.analytics().logEvent("save_note", { word_count: note.length });
    localStorage.setItem("note", note);
    setNote(note);
    setHelperText("已儲存");
  };

  function handleChange(event: React.ChangeEvent<{}>, newValue: number) {
    firebase.analytics().logEvent("click_tab", {
      // eslint-disable-next-line @typescript-eslint/camelcase
      tab_name: newValue === 0 ? "備忘錄" : "聊天室"
    });
    setValue(newValue);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const sendSuggestion = async () => {
    const supportApi = await getApi("Support");
    await supportApi.addAnonymousSupportTicket({
      newSupportTicket: {
        subject: params.name || "我要建議",
        body: suggestion,
        email: "awesomeSuggestion@milk.jobs"
      }
    });
    handleClose();
    setSuggestion("");
  };

  const getAwesomeList = useCallback(
    async (name: string) => {
      const awesomeApi = await getApi("Awesome");
      const list = await awesomeApi.getAwesomeLists({ name });
      setAwesomeList(list);
    },
    [getApi]
  );

  useEffect(() => {
    chat();
  }, []);

  useEffect(() => {
    if (params.name) {
      getAwesomeList(params.name);
    } else {
      getAwesomeList("台大電機");
    }
  }, [getAwesomeList, params]);

  return (
    <div className={classes.root}>
      <PageMetadata
        title={`${params.name}－牛奶找工作`}
        description={introduction}
      />
      <Header />
      <div style={{ display: "flex", flexDirection: "row", flex: 1 }}>
        <div className={classes.container}>
          <AwesomeHeader showStories showChatRoom />
          <div className={classes.headerContainer}>
            <div className={classes.header}>{introduction}</div>
            <Button
              style={{ minWidth: 100, marginLeft: 8 }}
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
            >
              我要建議
            </Button>
          </div>
          {awesomeList &&
            awesomeList.length > 0 &&
            awesomeList[0].teams &&
            awesomeList[0].teams.map(c => (
              <CompanyCard key={c.name + (params.name || "")} {...c} />
            ))}
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">我要建議</DialogTitle>
          <DialogContent>
            <DialogContentText>
              這些數據是牛奶找工作詢問系上教授、同學，及統計 LinkedIn 上 2010
              年後入學的學生，自行整理的名單，並沒有受公司委託進行廣告。如果有任何與事實不符的地方，或想補充、新增、刪除公司，歡迎留言告訴我們，一起幫助大學生畢業更有方向！
            </DialogContentText>
            <TextField
              value={suggestion}
              id="outlined-multiline-static"
              multiline
              rows="8"
              fullWidth
              variant="outlined"
              onChange={e => setSuggestion(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              取消
            </Button>
            <Button onClick={sendSuggestion} color="primary">
              送出
            </Button>
          </DialogActions>
        </Dialog>
        <div className={classes.chatRoom}>
          <Sticky top={48}>
            <Tabs
              value={value}
              onChange={handleChange}
              // indicatorColor="primary"
              textColor="primary"
              classes={tabsStyle}
            >
              <Tab disableRipple label="備忘錄" classes={tabStyle} />
              <Tab disableRipple label="聊天室" classes={tabStyle} />
            </Tabs>
            {!value && (
              <TextField
                fullWidth
                id="introduction"
                placeholder="隨手把工作資訊記下來"
                multiline
                style={{ padding: 24 }}
                onChange={e => saveNote(e.target.value)}
                value={note}
                rows="40"
                helperText={helperText}
              />
            )}
            <div
              id="tlkio"
              data-channel="NTU"
              data-nickname={user ? user.name : "路人"}
              data-theme="theme--minimal"
              style={{
                height: value ? "80vh" : 0,
                visibility: value ? "visible" : "hidden"
              }}
            ></div>
          </Sticky>
        </div>
      </div>
    </div>
  );
};

export default Awesome;
