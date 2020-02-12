import {
  Configuration,
  MembershipApi,
  VisitorPlan
} from "@frankyjuang/milkapi-client";
import { makeStyles } from "@material-ui/core/styles";
import { mdiEyeCheckOutline } from "@mdi/js";
import { Link } from "react-router-dom";
import Icon from "@mdi/react";
import { Header } from "components/Header";
import { apiServiceConfig } from "config";
import TextField from "@material-ui/core/TextField";
import React, { useEffect, useState } from "react";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Button from "@material-ui/core/Button";
import { useAuth } from "stores";
import { Slide, toast, ToastContainer, ToastPosition } from "react-toastify";

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.default
  },
  container: {
    marginTop: 8,
    marginLeft: 24,
    marginRight: 24,
    marginBottom: 30,
    display: "flex",
    flexGrow: 1,
    alignContent: "stretch",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.up("md")]: {
      width: 900,
      marginRight: "auto",
      marginLeft: "auto"
    }
  },
  title: {},
  plansContainer: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      width: "100%",
      flexDirection: "row",
      justifyItems: "space-around"
    },
    flexDirection: "column"
  },
  plan: {
    display: "flex",
    margin: 5,
    justifyContent: "center",
    height: 160,
    padding: 24,
    border: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: 4,
    textAlign: "left",
    fontSize: 16,
    flexDirection: "column",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1) !important",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
    [theme.breakpoints.up("md")]: {
      flex: 1,
      marginTop: 32,
      marginBottom: 32
    }
  },
  visitorToBe: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  free: {
    color: theme.palette.secondary.main
  }
}));

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
    marginLeft: theme.spacing(4),
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

const Pricing: React.FC = () => {
  const classes = useStyles();
  const { getApi } = useAuth();
  const [visitorPlans, setVisitorPlans] = useState<VisitorPlan[]>();
  const [value, setValue] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>();
  const [body, setBody] = useState<string>();
  const tabsStyle = useTabsStyles();
  const tabStyle = useTabStyles();

  const sendTicket = async () => {
    if (emailErrorMessage) {
      return;
    }

    const supportApi = await getApi("Support");
    await supportApi.addAnonymousSupportTicket({
      newSupportTicket: {
        subject: "廣告",
        phoneNumber,
        email,
        body
      }
    });
    setPhoneNumber(undefined);
    setEmail(undefined);
    setBody(undefined);
    toast.success("成功送出");
  };

  function handleChange(event: React.ChangeEvent<{}>, newValue: number) {
    setValue(newValue);
  }

  const getVisitorPlans = async () => {
    const membershpiApi = new MembershipApi(
      new Configuration({ basePath: apiServiceConfig.basePath })
    );
    const visitorPlans = await membershpiApi.getVisitorPlans();
    setVisitorPlans(visitorPlans);
  };

  useEffect(() => {
    getVisitorPlans();
  }, []);

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.container}>
        <h1>收費方案</h1>
        <Tabs
          value={value}
          onChange={handleChange}
          // indicatorColor="primary"
          textColor="primary"
          classes={tabsStyle}
          centered
        >
          <Tab disableRipple label="廣告" classes={tabStyle} />
          <Tab disableRipple label="一般" classes={tabStyle} />
        </Tabs>
        {Boolean(!value) && (
          <div>
            <h3>為了讓網站可以順利運作，我們有三種廣告服務：</h3>
            <h3>
              1. 將你徵才訊息置頂在指定科系的
              <Link to={"/awesome/台大電機"} style={{ color: "black" }}>
                就業精選版
              </Link>
              ・新台幣 1000 元／天
            </h3>
            <h3>
              2. 牛奶找工作臉書粉絲專頁，轉發你的徵才訊息・新台幣 2000 元／次
            </h3>
            <h3>3. 首頁的跑馬燈・新台幣 500 元／天</h3>
            <h3>有興趣的公司，留言告訴我們，會有專人聯絡你。</h3>
            <TextField
              fullWidth
              label="聯絡電話"
              onChange={e => setPhoneNumber(e.target.value)}
              style={{ marginBottom: 16 }}
              value={phoneNumber || ""}
              variant="outlined"
            />
            <TextField
              error={Boolean(emailErrorMessage)}
              fullWidth
              helperText={emailErrorMessage}
              label="聯絡 Email"
              onBlur={() => {
                const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
                if (email && !emailRegex.test(email)) {
                  setEmailErrorMessage("請輸入正確的 Email");
                } else {
                  setEmailErrorMessage(undefined);
                }
              }}
              onChange={e => {
                setEmail(e.target.value);
                setEmailErrorMessage(undefined);
              }}
              style={{ marginBottom: 16 }}
              value={email || ""}
              variant="outlined"
            />
            <TextField
              fullWidth
              multiline
              onChange={e => setBody(e.target.value)}
              placeholder="告訴我們你想要什麼方案，以及你的需求"
              rows="8"
              style={{ marginBottom: 16 }}
              value={body || ""}
              variant="outlined"
            />
            <Button
              style={{ minWidth: 100, marginLeft: 8 }}
              variant="contained"
              color="primary"
              onClick={sendTicket}
            >
              送出
            </Button>
            <ToastContainer
              position={ToastPosition.BOTTOM_CENTER}
              draggable={false}
              hideProgressBar
              transition={Slide}
            />
          </div>
        )}
        {Boolean(value) && (
          <div>
            <h3>牛奶找工作，依職缺的點閱人數收費</h3>
            <h3>企業根據自己刊登職缺的需求，用多少付多少</h3>
            <h3>不再有付了錢，卻沒有曝光的窘境</h3>
            <h3 className={classes.free}>
              現在加入，立刻送 1000 個免費點閱人數
            </h3>
            <div className={classes.plansContainer}>
              {visitorPlans &&
                visitorPlans.map((p, i) => (
                  <div key={i} className={classes.plan}>
                    <div className={classes.visitorToBe}>
                      <Icon
                        path={mdiEyeCheckOutline}
                        size={0.7}
                        style={{ marginRight: 4 }}
                      />
                      {p.visitorsToBe.toLocaleString()}
                    </div>
                    <div>{p.price.toLocaleString() + " 元"}</div>
                  </div>
                ))}
            </div>
            <h3>登入牛奶找工作，創建公司後，即可在公司後台系統購買。</h3>
            <h3>
              {" "}
              * 點閱人數是採不重複計算，一個使用者看 10 次，只會計算 1 次
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pricing;
