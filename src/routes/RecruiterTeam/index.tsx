import { Team } from "@frankyjuang/milkapi-client";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Header } from "components/Header";
import { JobCard } from "components/Job";
import {
  TeamDescription,
  TeamInfo,
  TeamLocation,
  TeamOfficialInfo,
  TeamWebsite
} from "components/TeamComponents";
import RecruiterTeamSideCard from "components/TeamComponents/recruiterTeamSideCard";
import { InitialTeam } from "helpers";
import React, { useEffect, useState } from "react";
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
  team: Team;
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
        <RecruiterTeamSideCard {...team} />
      </div>
    </div>
  );
};

const TeamJobs: React.FC<Props> = props => {
  const { team } = props;

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 2, marginTop: 16 }}>
        {team.jobs &&
          team.jobs.map((value, index) => {
            value.team = team;
            return (
              <JobCard
                {...value}
                key={index}
                targetPath={`/recruiter/job/${value.uuid}`}
              />
            );
          })}
      </div>
    </div>
  );
};

const RecruiterTeam: React.FC = () => {
  const [team, setTeam] = useState<Team>(InitialTeam);
  const [value, setValue] = useState(0);
  const { user, getApi } = useAuth();
  const classes = useStyles();

  function handleChange(event: React.ChangeEvent<{}>, newValue: number) {
    setValue(newValue);
  }

  useEffect(() => {
    const getTeam = async () => {
      const teamApi = await getApi("Team");
      const fetchTeam =
        user &&
        user.recruiterInfo &&
        user.recruiterInfo.team &&
        (await teamApi.getTeam({
          teamId: user.recruiterInfo.team.uuid
        }));
      fetchTeam && setTeam(fetchTeam);
    };

    getTeam();
  }, [user, getApi]);

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.container}>
        <TeamInfo {...team} />
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
        {value === 0 && <TeamIntroduction team={team} />}
        {value === 1 && <TeamJobs team={team} />}
      </div>
    </div>
  );
};

export default RecruiterTeam;
