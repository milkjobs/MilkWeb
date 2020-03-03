import { Team as TeamType, UserApi } from "@frankyjuang/milkapi-client";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import algoliasearch, { SearchClient } from "algoliasearch/lite";
import { Header } from "components/Header";
import { JobList } from "components/JobSearch";
import {
  TeamDescription,
  TeamInfo,
  TeamLocation,
  TeamOfficialInfo,
  TeamWebsite
} from "components/TeamComponents";
import RecruiterTeamSideCard from "components/TeamComponents/recruiterTeamSideCard";
import { algoliaConfig } from "config";
import { AlgoliaService } from "helpers";
import React, { useEffect, useState } from "react";
import { connectRefinementList, InstantSearch } from "react-instantsearch-dom";
import { useAuth } from "stores";

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
  container: {
    backgroundColor: theme.palette.background.paper,
    marginTop: 40,
    display: "flex",
    marginLeft: "auto",
    marginRight: "auto",
    alignContent: "stretch",
    justifyContent: "center",
    flexDirection: "column",
    [theme.breakpoints.up("md")]: {
      width: "960px"
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
      <div style={{ flex: 2 }}>
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
        <RecruiterTeamSideCard team={team} />
      </div>
    </div>
  );
};

const TeamJobs: React.FC<Props> = props => {
  const { user, getApi } = useAuth();
  const { team } = props;
  const [algoliaClient, setAlgoliaClient] = useState<SearchClient>();

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
              attribute="team.uuid"
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
  const [value, setValue] = useState(0);
  const { user, getApi } = useAuth();
  const [team, setTeam] = useState<TeamType>();
  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    const getTeam = async () => {
      user &&
        user.recruiterInfo &&
        user.recruiterInfo.team &&
        setTeam(user.recruiterInfo.team);
    };

    getTeam();
  }, [user, getApi]);

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.container}>
        {team && <TeamInfo {...team} />}
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          classes={useTabsStyles()}
        >
          <Tab disableRipple label="團隊介紹" classes={useTabStyles()} />
          <Tab disableRipple label="人才招募" classes={useTabStyles()} />
        </Tabs>
        {value === 0 && team && <TeamIntroduction team={team} />}
        {value === 1 && team && <TeamJobs team={team} />}
      </div>
    </div>
  );
};

export default Team;
