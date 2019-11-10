import { Job as JobModel } from "@frankyjuang/milkapi-client";
import { makeStyles } from "@material-ui/core/styles";
import { Header } from "components/Header";
import {
  JobDescription,
  JobFooter,
  JobLocation,
  JobSideCard,
  JobTitle
} from "components/Job";
import "firebase/analytics";
import firebase from "firebase/app";
import { InitialJob } from "helpers";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
    paddingTop: 40,
    paddingBottom: 100,
    height: "100%",
    flex: 1,
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.down("xs")]: {
      paddingTop: 0,
      paddingBottom: 0
    }
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
    marginRight: 24,
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column"
    }
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

const Job: React.FC = () => {
  const { getApi, isAuthenticated } = useAuth();
  const params = useParams<{ id: string }>();
  const classes = useStyles();
  const [job, setJob] = useState(InitialJob);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      const jobApi = await getApi("Job");
      let fetchedJob: JobModel;
      if (isAuthenticated) {
        fetchedJob = await jobApi.getJob({ jobId: params.id });
      } else {
        fetchedJob = await jobApi.getJobAnonymously({ jobId: params.id });
      }
      setJob(fetchedJob);
      setLoading(false);
      firebase
        .analytics()
        .logEvent("view_item", { items: [{ id: fetchedJob.uuid }] });
    };
    fetchJob();
  }, [getApi, isAuthenticated, params.id]);

  return (
    <div className={classes.root}>
      <Header />
      {!loading && (
        <div className={classes.container}>
          <div className={classes.infoContainer}>
            <div className={classes.titleContainer}>
              <JobTitle {...job} />
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
              {job.recruiter && (
                <div className={classes.descriptionSide}>
                  <JobSideCard recruiter={job.recruiter} jobId={job.uuid} />
                </div>
              )}
            </div>
            {job.recruiter && <JobFooter recruiter={job.recruiter} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Job;
