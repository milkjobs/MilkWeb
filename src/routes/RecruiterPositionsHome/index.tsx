import { Job } from "@frankyjuang/milkapi-client";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { Header } from "components/Header";
import { JobCard, JobCreateForm } from "components/Job";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "stores";

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper
  },
  container: {
    marginTop: 30,
    marginLeft: "auto",
    marginRight: "auto",
    display: "flex",
    paddingRight: 24,
    paddingLeft: 24,
    flexDirection: "column",
    justifyContent: "center",

    [theme.breakpoints.up("md")]: {
      width: "860px"
    }
  },
  title: {
    display: "flex",
    alignItems: "center",
    fontSize: 24,
    fontWeight: 400,
    color: "#484848"
  },
  titleContainer: {
    display: "flex",
    paddingBottom: 12,
    marginBottom: 12,
    paddingRight: 24,
    paddingLeft: 24,
    borderBottom: "1px solid rgba(0, 0, 0, 0.1)"
  },
  addPositionButton: {
    display: "flex",
    marginLeft: "auto",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    borderRadius: 4,
    textDecoration: "none",
    alignItems: "center",
    color: "white",
    fontSize: 14
  }
}));

const RecruiterPositionsHome: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();
  const [positions, setPositions] = useState<Job[]>([]);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const classes = useStyles();

  useEffect(() => {
    if (user && user.recruiterInfo && user.recruiterInfo.jobs)
      setPositions(user.recruiterInfo.jobs);
  }, [user]);

  return (
    <div className={classes.root}>
      <Header />
      <JobCreateForm open={formOpen} handleClose={() => setFormOpen(false)} />
      <div className={classes.container}>
        <div className={classes.titleContainer}>
          <span className={classes.title}>職缺</span>
          <Button
            variant="contained"
            color="primary"
            className={classes.addPositionButton}
            onClick={() => setFormOpen(true)}
          >
            <span>發布職缺</span>
          </Button>
        </div>
        <div>
          {positions.length !== 0 ? (
            positions.map((value, index) => {
              if (user && user.recruiterInfo && user.recruiterInfo.team)
                value.team = user.recruiterInfo.team;
              return (
                <JobCard
                  {...value}
                  key={index}
                  targetPath={`/recruiter/job/${value.uuid}`}
                />
              );
            })
          ) : (
            <div>目前沒有職缺</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterPositionsHome;
