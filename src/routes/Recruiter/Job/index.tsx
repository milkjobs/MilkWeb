import { makeStyles } from "@material-ui/core/styles";
import {
  JobDescription,
  JobLocation,
  JobTitle,
  RecruiterJobSideCard
} from "components/Job";
import { Header } from "components/Header";
import { InitialJob } from "helpers";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useAuth } from "stores";

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 100
  },
  imgContainer: {
    width: "100%",
    height: "450px",
    background: "#EBEBEB",
    position: "relative",
    marginBottom: 8,
    overflow: "hidden"
  },
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "960px"
    },
    [theme.breakpoints.up("lg")]: {
      width: "1160px"
    }
  },
  titleContainer: {
    flex: 1,
    marginLeft: 24,
    marginRight: 24
  },
  descriptionContainer: {
    display: "flex",
    flex: 1,
    marginLeft: 24,
    marginRight: 24
  },
  descriptionContent: {
    flex: 2
  },
  descriptionSide: {
    flex: 1,
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  }
}));

const RecruiterJob: React.FC = () => {
  const { user } = useAuth();
  const params = useParams<{ id: string }>();
  const history = useHistory();
  const classes = useStyles();
  const [job, setJob] = useState(InitialJob);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (
      user &&
      user.recruiterInfo &&
      user.recruiterInfo.jobs &&
      user.recruiterInfo.team
    ) {
      const foundJob = user.recruiterInfo.jobs.find(j => j.uuid === params.id);
      if (foundJob) {
        setJob({ ...foundJob, team: user.recruiterInfo.team });
        setLoading(false);
        return;
      }
    }
    history.push("/");
  }, [history, params.id, user]);

  return (
    <div className={classes.root}>
      <Header />
      {!loading && (
        <div className={classes.container}>
          <div className={classes.infoContainer}>
            <div className={classes.titleContainer}>
              <JobTitle {...job} teamLinkDisabled />
            </div>
            <div className={classes.descriptionContainer}>
              <div className={classes.descriptionContent}>
                {job.description && (
                  <JobDescription
                    description={job.description}
                    skillTags={job.skillTags}
                  />
                )}
                <JobLocation address={job.address} />
              </div>
              <div className={classes.descriptionSide}>
                <RecruiterJobSideCard job={job} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterJob;
