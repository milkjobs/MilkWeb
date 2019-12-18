import {
  Configuration,
  MembershipApi,
  VisitorPlan
} from "@frankyjuang/milkapi-client";
import { makeStyles } from "@material-ui/core/styles";
import { mdiEyeCheckOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { Header } from "components/Header";
import { apiServiceConfig } from "config";
import React, { useEffect, useState } from "react";

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

const Pricing: React.FC = () => {
  const classes = useStyles();
  const [visitorPlans, setVisitorPlans] = useState<VisitorPlan[]>();

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
        <h3>牛奶找工作，依職缺的點閱人數收費</h3>
        <h3>企業根據自己刊登職缺的需求，用多少付多少</h3>
        <h3>不再有付了錢，卻沒有曝光的窘境</h3>
        <h3 className={classes.free}>現在加入，立刻送 1000 個免費點閱人數</h3>
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
        <h3> * 點閱人數是採不重複計算，一個使用者看10次，只會計算1次</h3>
      </div>
    </div>
  );
};

export default Pricing;
