import { Membership } from "@frankyjuang/milkapi-client";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { mdiEyeCheckOutline } from "@mdi/js";
import Icon from "@mdi/react";
import to from "await-to-js";
import { Header } from "components/Header";
import { Title } from "components/Util";
import { NotFound } from "helpers";
import React, { useCallback, useEffect, useState } from "react";
import {
  Link,
  Route,
  Switch,
  useLocation,
  useRouteMatch
} from "react-router-dom";
import { useAuth, useTheme } from "stores";
import Buy from "./Buy";
import History from "./History";
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
    justifyContent: "center",
    marginBottom: 100,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 40,
    paddingLeft: 24,
    paddingRight: 24,
    [theme.breakpoints.up("md")]: {
      width: "960px"
    }
  },
  icon: {
    marginTop: "auto",
    marginBottom: "auto",
    marginLeft: 8,
    marginRight: 8,
    color: theme.palette.text.primary
  }
}));

const VisitorsToBe: React.FC = () => {
  const classes = useStyles();
  const tabsStyle = useTabsStyles();
  const tabStyle = useTabStyles();
  const match = useRouteMatch();
  const location = useLocation();
  const { getApi, user } = useAuth();
  const { theme } = useTheme();
  const [membership, setMembership] = useState<Membership>();
  const [tabIndex, setTabIndex] = useState(0);

  const getTeamMembership = useCallback(async () => {
    const teamId = user?.recruiterInfo?.team?.uuid;
    if (teamId) {
      const membershipApi = await getApi("Membership");
      const [, fetchedMembership] = await to(
        membershipApi.getTeamMembership({
          teamId
        })
      );
      setMembership(fetchedMembership);
    }
  }, [getApi, user]);

  useEffect(() => {
    getTeamMembership();
  }, [getTeamMembership]);

  useEffect(() => {
    if (location.pathname === "/recruiter/visitors-to-be/usage") {
      setTabIndex(0);
    } else if (location.pathname === "/recruiter/visitors-to-be/buy") {
      setTabIndex(1);
    } else if (location.pathname === "/recruiter/visitors-to-be/history") {
      setTabIndex(2);
    }
  }, [location.pathname]);

  useEffect(() => {
    const listener = (e: MessageEvent) => {
      try {
        const eventData = JSON.parse(e.data);
        if ("MerchantID" in eventData) {
          getTeamMembership();
        }
      } catch {
        console.warn("Unknown message event");
      }
    };

    window.addEventListener("message", listener);

    return () => {
      window.removeEventListener("message", listener);
    };
  }, [getTeamMembership]);

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.container}>
        {membership && (
          <Title
            customTextComponent={
              <>
                可使用的點閱人數
                <Icon
                  className={classes.icon}
                  path={mdiEyeCheckOutline}
                  size={1}
                  color={theme.palette.text.primary}
                />
                {membership.visitorsToBe.toLocaleString()}
              </>
            }
            hideBottomLine
          />
        )}
        <Tabs
          classes={tabsStyle}
          indicatorColor="primary"
          onChange={(_e, value) => setTabIndex(value)}
          textColor="primary"
          value={tabIndex}
        >
          <Tab
            disableRipple
            label="使用紀錄"
            to={`${match.url}/usage`}
            component={Link}
            classes={tabStyle}
          />
          <Tab
            disableRipple
            label="購買點閱人數"
            to={`${match.url}/buy`}
            component={Link}
            classes={tabStyle}
          />
          <Tab
            disableRipple
            label="購買紀錄"
            to={`${match.url}/history`}
            component={Link}
            classes={tabStyle}
          />
        </Tabs>
        {match && (
          <Switch>
            <Route
              path={[match.path, `${match.path}/usage`]}
              exact
              component={Usage}
            />
            <Route path={`${match.path}/buy`} exact component={Buy} />
            <Route path={`${match.path}/history`} exact component={History} />
            <Route path={match.path} component={NotFound} />
          </Switch>
        )}
      </div>
    </div>
  );
};

export default VisitorsToBe;
