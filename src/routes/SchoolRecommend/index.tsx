import { makeStyles, Theme } from "@material-ui/core/styles";
import { Header } from "components/Header";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { openInNewTab, checkUrl } from "helpers";
import { useMediaQuery } from "@material-ui/core";
import { useAuth } from "stores";
import { AwesomeList } from "@frankyjuang/milkapi-client";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

interface Company {
  name: string;
  logoUrl: string;
  website: string;
  headcount?: number;
  revenue?: number;
  introduction: string;
}

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper
  },
  container: {
    marginTop: 40,
    marginBottom: 40,
    display: "flex",
    justifyContent: "center",
    marginRight: "auto",
    marginLeft: "auto",
    paddingRight: 24,
    paddingLeft: 24,
    flexDirection: "column",
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up("md")]: {
      width: "960px"
    },
    [theme.breakpoints.down("xs")]: {
      marginTop: 8,
      marginBottom: 8
    }
  },
  schoolContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    padding: 16
  },
  schoolTitle: {
    fontWeight: 800,
    marginRight: 16
  },
  majorButton: {
    textDecoration: "none"
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
    fontWeight: 800
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
  }
}));

const CompanyCard: React.FC<Company> = props => {
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

  return (
    <div
      className={classes.companyCardContainer}
      onClick={() => openInNewTab(checkUrl(props.website))}
    >
      {!matched && <img src={props.logoUrl} className={classes.logo} />}
      <div className={classes.nameContainer}>
        <div className={classes.iconContainer}>
          {matched && <img src={props.logoUrl} className={classes.logo} />}
          <div>
            <div className={classes.title}>{props.name}</div>
            <div className={classes.info}>
              {`${props.headcount ? sizeToWord(props.headcount) : ""}   ${
                props.revenue ? incomeToWord(props.revenue) : ""
              }`}
            </div>
          </div>
        </div>
        <div className={classes.description}>{props.introduction}</div>
      </div>
    </div>
  );
};

const Awesome: React.FC = () => {
  const { getApi } = useAuth();
  const params = useParams<{ name: string }>();
  const classes = useStyles();
  const [awesomeList, setAwesomeList] = useState<AwesomeList[]>();
  const [open, setOpen] = useState(false);
  const [suggestion, setSuggestion] = useState<string>();

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
        subject: params.name || "台大電機",
        body: suggestion,
        email: "awesomeSuggestion@milk.jobs"
      }
    });
    handleClose();
    setSuggestion("");
  };

  const getAwesomeList = async (name: string) => {
    const awesomeApi = await getApi("Awesome");
    const list = await awesomeApi.getAwesomeLists({ name });
    setAwesomeList(list);
  };

  useEffect(() => {
    if (params.name) {
      getAwesomeList(params.name);
    } else getAwesomeList("台大電機");
  }, [params]);

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.container}>
        <div className={classes.schoolContainer}>
          <Link to={{ pathname: "/stories" }} className={classes.majorButton}>
            <Button>故事</Button>
          </Link>
          <Link
            to={{ pathname: "/awesome/台大電機" }}
            className={classes.majorButton}
          >
            <Button>台大電機</Button>
          </Link>
          <Link
            to={{ pathname: "/awesome/台大資工" }}
            className={classes.majorButton}
          >
            <Button>台大資工</Button>
          </Link>
          <Link
            to={{ pathname: "/awesome/台大財金" }}
            className={classes.majorButton}
          >
            <Button>台大財金</Button>
          </Link>
          <Link
            to={{ pathname: "/awesome/台大國企" }}
            className={classes.majorButton}
          >
            <Button>台大國企</Button>
          </Link>
          <Link
            to={{ pathname: "/awesome/台大化工" }}
            className={classes.majorButton}
          >
            <Button>台大化工</Button>
          </Link>
          <Link
            to={{ pathname: "/awesome/台大機械" }}
            className={classes.majorButton}
          >
            <Button>台大機械</Button>
          </Link>
          <Link
            to={{ pathname: "/awesome/台大公衛" }}
            className={classes.majorButton}
          >
            <Button>台大公衛</Button>
          </Link>
          <Link
            to={{ pathname: "/awesome/台大藥學" }}
            className={classes.majorButton}
          >
            <Button>台大藥學</Button>
          </Link>
        </div>
        {awesomeList && (
          <div className={classes.headerContainer}>
            <div className={classes.header}>
              為了幫助學生更了解自己有哪些選擇，我們整理了{awesomeList[0].name}
              畢業生，最常去的公司。
              <br />
              先從這些公司開始應徵吧!
            </div>
            <Button
              style={{ minWidth: 100, marginLeft: 8 }}
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
            >
              我要建議
            </Button>
          </div>
        )}
        {awesomeList &&
          awesomeList.length > 0 &&
          awesomeList[0].teams &&
          awesomeList[0].teams.map(c => <CompanyCard key={c.name} {...c} />)}
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">我要建議</DialogTitle>
        <DialogContent>
          <DialogContentText>
            這些數據，是牛奶找工作，詢問系上教授、請教同學、統計 Linkedin 上
            2010
            後入學的學生，得出的名單。如果有任何與事實不符的地方，或想補充、新增公司，歡迎留言告訴我們，一起幫助大學生畢業更有方向！
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
    </div>
  );
};

export default Awesome;
