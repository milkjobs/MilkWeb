import { makeStyles } from "@material-ui/core/styles";
import to from "await-to-js";
import { Header } from "components/Header";
import React, { useEffect, useState } from "react";
import {
  MembershipApi,
  Configuration,
  VisitorPlan
} from "@frankyjuang/milkapi-client";
import { apiServiceConfig } from "config";

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
  }
}));

const Charges: React.FC = () => {
  const classes = useStyles();
  const [visitorPlans, setVisitorPlans] = useState<VisitorPlan[]>();

  const getVisitorPlans = async () => {
    const membershpiApi = new MembershipApi(
      new Configuration({ basePath: apiServiceConfig.basePath })
    );
    // const visitorPlans = await membershpiApi.getVisitorPlans();
    setVisitorPlans([
      { uuid: "1", price: 500, visitorsToBe: 250 },
      { uuid: "2", price: 2000, visitorsToBe: 2000 },
      { uuid: "3", price: 5000, visitorsToBe: 6000 },
      { uuid: "4", price: 10000, visitorsToBe: 15000 },
      { uuid: "5", price: 20000, visitorsToBe: 40000 }
    ]);
  };

  useEffect(() => {
    getVisitorPlans();
  }, []);

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.container}>
        <h1>收費方案</h1>
        <h4>
          牛奶找工作，按職缺的點閱人數收費。企業根據自己刊登職缺的需求，選擇購買合適數量的點閱人數。
        </h4>
        <div className={classes.plansContainer}>
          {visitorPlans &&
            visitorPlans.map(p => (
              <div className={classes.plan}>
                <div>{p.visitorsToBe.toLocaleString() + " 點閱人數"}</div>
                <div>{p.price.toLocaleString() + " 元"}</div>
              </div>
            ))}
        </div>
        <h4>登入牛奶找工作，創建公司後，即可在公司後台系統購買。</h4>
      </div>
    </div>
  );
};

export default Charges;
