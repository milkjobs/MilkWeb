import { Membership, PointPlan } from "@frankyjuang/milkapi-client";
import { makeStyles } from "@material-ui/core/styles";
import { Header } from "components/Header";
import React, { useEffect, useState } from "react";
import { Link, Switch, Route, useRouteMatch } from "react-router-dom";
import { useAuth, useTheme } from "stores";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Icon from "@mdi/react";
import { mdiAlphaPCircleOutline } from "@mdi/js";
import { MemberPlanCard } from "components/Point";
import Usage from "./Usage";

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

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.default
  },
  container: {
    display: "flex",
    flexDirection: "column",
    marginRight: "auto",
    marginLeft: "auto",
    justifyContent: "center",
    alignContent: "stretch",
    width: 960,
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    },
    marginBottom: 100
  },
  memberPlanCardContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 24
  },
  title: {
    color: theme.palette.text.primary,
    fontSize: 24,
    marginRight: 12,
    [theme.breakpoints.down("sm")]: {
      fontSize: 16
    }
  },
  pointIcon: {
    marginTop: "auto",
    marginBottom: "auto",
    color: theme.palette.text.primary
  },
  point: {
    color: theme.palette.text.primary,
    fontSize: 24,
    [theme.breakpoints.down("sm")]: {
      fontSize: 16
    }
  },
  link: {
    color: theme.palette.text.primary,
    cursor: "pointer",
    marginBottom: 32,
    textDecoration: "none"
  }
}));

const RecruiterAccount: React.FC = () => {
  const match = useRouteMatch();
  const { getApi, user } = useAuth();
  const { theme } = useTheme();
  const [pointPlans, setPointPlans] = useState<PointPlan[]>();
  const [membership, setMembership] = useState<Membership>();
  const classes = useStyles();
  const [value, setValue] = useState(0);

  function handleChange(event: React.ChangeEvent<{}>, newValue: number) {
    setValue(newValue);
  }

  useEffect(() => {
    const getPointPlans = async () => {
      const membershipApi = await getApi("Membership");
      const fetchPointPlans = await membershipApi.getPointPlans();
      fetchPointPlans && setPointPlans(fetchPointPlans);
    };

    const getTeamMembership = async () => {
      if (user && user.recruiterInfo && user.recruiterInfo.team) {
        const membershipApi = await getApi("Membership");
        const fetchMembership = await membershipApi.getTeamMembership({
          teamId: user.recruiterInfo.team.uuid
        });
        setMembership(fetchMembership);
      }
    };
    const listener = (e: MessageEvent) => {
      try {
        const eventData = JSON.parse(e.data);
        if ("MerchantID" in eventData) {
          getTeamMembership();
        }
      } catch {
        console.error("Payment listener failed");
      }
    };

    getPointPlans();
    getTeamMembership();
    window.addEventListener("message", listener);

    return () => {
      window.removeEventListener("message", listener);
    };
  }, [getApi, user]);

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.container}>
        {membership && (
          <div className={classes.titleContainer}>
            <div className={classes.title}>目前點數</div>
            <Icon
              className={classes.pointIcon}
              path={mdiAlphaPCircleOutline}
              size={1}
              color={theme.palette.text.primary}
            />
            <div className={classes.point}>
              {membership.points.toLocaleString()}
            </div>
          </div>
        )}
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          classes={useTabsStyles()}
        >
          <Tab disableRipple label="使用紀錄" classes={useTabStyles()} />
          <Tab disableRipple label="點數儲值" classes={useTabStyles()} />
          <Tab disableRipple label="儲值紀錄" classes={useTabStyles()} />
          <Tab disableRipple label="點數規則" classes={useTabStyles()} />
        </Tabs>
        {match && (
          <Switch>
            <Route path={`${match.path}`} exact component={Usage} />
          </Switch>
        )}
      </div>
    </div>
  );
};

export default RecruiterAccount;
