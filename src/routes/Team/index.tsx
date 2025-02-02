import { Team as TeamType } from "@frankyjuang/milkapi-client";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import to from "await-to-js";
import { Header } from "components/Header";
import { TeamInfo } from "components/TeamComponents";
import { ErrorStatus } from "components/Util";
import { PageMetadata } from "helpers";
import React, { useEffect, useState } from "react";
import {
  Link,
  Redirect,
  Route,
  Switch,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import { useAuth } from "stores";
import Intro from "./Intro";
import Jobs from "./Jobs";

const useTabsStyles = makeStyles((theme) => ({
  root: {
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: theme.palette.divider,
    paddingLeft: 24,
    paddingRight: 24,
  },
  indicator: {
    backgroundColor: theme.palette.text.primary,
  },
}));

const useTabStyles = makeStyles((theme) => ({
  root: {
    textTransform: "none",
    color: theme.palette.grey["500"],
    minWidth: 72,
    fontSize: 16,
    [theme.breakpoints.down("xs")]: {
      fontSize: 14,
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
      '"Segoe UI Symbol"',
    ].join(","),
    "&:hover": {
      color: theme.palette.secondary.main,
      opacity: 1,
    },
    "&$selected": {
      color: theme.palette.text.primary,
    },
  },
  selected: {},
}));

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper,
  },
  container: {
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    flexDirection: "column",
    marginLeft: "auto",
    marginRight: "auto",
    paddingBottom: 100,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 40,
    [theme.breakpoints.up("md")]: {
      width: "960px",
    },
    [theme.breakpoints.down("xs")]: {
      paddingTop: 0,
      paddingBottom: 0,
    },
  },
  title: {
    display: "flex",
    fontSize: 24,
    marginLeft: 24,
    marginBottom: 16,
    fontWeight: "bold",
    color: "#484848",
  },
  loading: {
    flex: 1,
    marginTop: 200,
  },
}));

const Team: React.FC = () => {
  const classes = useStyles();
  const tabsStyle = useTabsStyles();
  const tabStyle = useTabStyles();
  const match = useRouteMatch();
  const matchJobsRoute = useRouteMatch("/team/:id/jobs");
  const params = useParams<{ id: string }>();
  const { getApi } = useAuth();
  const [tabIndex, setTabIndex] = useState(matchJobsRoute ? 1 : 0);
  const [team, setTeam] = useState<TeamType>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTeam = async () => {
      setLoading(true);
      const teamApi = await getApi("Team");
      const [, fetchTeam] = await to(
        teamApi.getTeam({
          teamId: params.id,
        })
      );
      setTeam(fetchTeam);
      setLoading(false);
    };

    getTeam();
  }, [getApi, params.id]);

  return (
    <div className={classes.root}>
      {team && (
        <PageMetadata
          title={`${team.nickname}－牛奶找工作`}
          description={team.introduction}
          image={team.logoUrl}
        />
      )}
      <Header />
      {loading ? (
        <CircularProgress className={classes.loading} />
      ) : !team ? (
        <ErrorStatus
          subheader="我們找不到這間公司。"
          description="錯誤代碼：404"
        />
      ) : (
        <div className={classes.container}>
          <TeamInfo {...team} />
          <Tabs
            value={tabIndex}
            onChange={(_e, value) => setTabIndex(value)}
            indicatorColor="primary"
            textColor="primary"
            classes={tabsStyle}
          >
            <Tab
              classes={tabStyle}
              component={Link}
              disableRipple
              label="公司介紹"
              to={`/team/${params.id}/intro`}
            />
            <Tab
              classes={tabStyle}
              component={Link}
              disableRipple
              label="工作機會"
              to={`/team/${params.id}/jobs`}
            />
          </Tabs>
          {match && (
            <Switch>
              <Route path={[match.path, `${match.path}/intro`]} exact>
                <Intro team={team} />
              </Route>
              <Route path={`${match.path}/jobs`} exact>
                <Jobs team={team} />
              </Route>
              <Route path={match.path}>
                <Redirect to={`/team/${params.id}`} />
              </Route>
            </Switch>
          )}
        </div>
      )}
    </div>
  );
};

export default Team;
