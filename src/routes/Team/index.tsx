import { Team as TeamType, UserApi } from "@frankyjuang/milkapi-client";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Header } from "components/Header";
import {
  TeamDescription,
  TeamInfo,
  TeamLocation,
  TeamOfficialInfo,
  TeamSideCard,
  TeamWebsite
} from "components/TeamComponents";
import { JobList } from "components/JobSearch";
import { AlgoliaService, PageMetadata } from "helpers";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { InstantSearch, connectRefinementList } from "react-instantsearch-dom";
import { useAuth } from "stores";
import algoliasearch from "algoliasearch";
import { algoliaConfig } from "config";

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
    backgroundColor: theme.palette.background.paper
  },
  containerMaster: {
    marginTop: 40,
    display: "flex",
    marginLeft: "auto",
    marginRight: "auto",
    alignContent: "stretch",
    justifyContent: "center",
    flexDirection: "column",
    [theme.breakpoints.up("lg")]: {
      width: "1120px"
    },
    [theme.breakpoints.down("xs")]: {
      marginTop: 0
    }
  },
  title: {
    display: "flex",
    fontSize: 24,
    marginLeft: 24,
    marginBottom: 16,
    fontWeight: "bold",
    color: "#484848"
  },
  sideCard: {
    flex: 1,
    marginLeft: 8,
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  },
  loading: {
    flex: 1,
    marginTop: 200
  }
}));

interface Props {
  team: TeamType;
}

const TeamIntroduction: React.FC<Props> = props => {
  const { team } = props;
  const classes = useStyles();
  const theme = useTheme();
  const smMatches = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 2, paddingBottom: 24 }}>
        <TeamDescription introduction={team.introduction} />
        <TeamLocation address={team.address} />
        {smMatches && team.website && <TeamWebsite website={team.website} />}
        {smMatches && (
          <TeamOfficialInfo
            name={team.name}
            unifiedNumber={team.unifiedNumber}
          />
        )}
      </div>
      <div className={classes.sideCard}>
        <TeamSideCard {...team} />
      </div>
    </div>
  );
};

const TeamJobs: React.FC<Props> = props => {
  const { user, getApi } = useAuth();
  const { team } = props;
  const [algoliaClient, setAlgoliaClient] = useState<algoliasearch.Client>();

  useEffect(() => {
    const getApiKey = async () => {
      if (user) {
        const userApi = (await getApi("User")) as UserApi;
        const algoliaService = new AlgoliaService(user.uuid, userApi);
        return await algoliaService.getApiKey();
      }
      const miscApi = await getApi("Misc");
      const algoliaCredential = await miscApi.getAnonymousAlgoliaCredential();
      return algoliaCredential.apiKey;
    };

    const setClient = async () => {
      const apiKey = await getApiKey();
      const algoliaClient = algoliasearch(algoliaConfig.appId, apiKey);
      setAlgoliaClient(algoliaClient);
    };
    setClient();
  }, [user, getApi]);

  const RefinementList = connectRefinementList(() => <div />);
  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 2, marginTop: 16 }}>
        {algoliaClient && (
          <InstantSearch
            indexName={algoliaConfig.index}
            searchClient={algoliaClient}
          >
            <RefinementList
              attribute={"team.uuid"}
              defaultRefinement={[team.uuid]}
            />
            <JobList />
          </InstantSearch>
        )}
      </div>
    </div>
  );
};

const Team: React.FC = () => {
  const classes = useStyles();
  const params = useParams<{ id: string }>();
  const { getApi } = useAuth();
  const [value, setValue] = useState(0);
  const [team, setTeam] = useState<TeamType>();
  const tabsStyle = useTabsStyles();
  const tabStyle = useTabStyles();

  function handleChange(event: React.ChangeEvent<{}>, newValue: number) {
    setValue(newValue);
  }

  useEffect(() => {
    const updateTeam = async () => {
      const teamApi = await getApi("Team");
      const fetchTeam = await teamApi.getTeam({
        teamId: params.id
      });
      setTeam(fetchTeam);
    };

    updateTeam();
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
      {team ? (
        <div className={classes.containerMaster}>
          <TeamInfo {...team} />
          <Tabs
            value={value}
            onChange={handleChange}
            // indicatorColor="primary"
            textColor="primary"
            classes={tabsStyle}
          >
            <Tab disableRipple label="團隊介紹" classes={tabStyle} />
            <Tab disableRipple label="人才招募" classes={tabStyle} />
          </Tabs>
          {value === 0 && <TeamIntroduction team={team} />}
          {value === 1 && <TeamJobs team={team} />}
        </div>
      ) : (
        <CircularProgress className={classes.loading} />
      )}
    </div>
  );
};

export default Team;
