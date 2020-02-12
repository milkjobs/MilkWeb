import { Job } from "@frankyjuang/milkapi-client";
import { makeStyles } from "@material-ui/core";
import { Header } from "components/Header";
import { JobCreateForm, RecruiterJobCard } from "components/Job";
import { Title } from "components/Util";
import { VerificationStateBanner } from "components/Verification";
import React, { useEffect, useState } from "react";
import { useAuth } from "stores";

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 40,
    paddingLeft: 24,
    paddingRight: 24,
    [theme.breakpoints.up("md")]: {
      width: "900px"
    }
  }
}));

const RecruiterPositionsHome: React.FC = () => {
  const classes = useStyles();
  const { user } = useAuth();
  const [positions, setPositions] = useState<Job[]>([]);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    if (user?.recruiterInfo?.jobs) {
      setPositions(user.recruiterInfo.jobs);
    }
  }, [user]);

  return (
    <div className={classes.root}>
      <Header />
      <JobCreateForm open={formOpen} handleClose={() => setFormOpen(false)} />
      <div className={classes.container}>
        <VerificationStateBanner
          containerStyle={{
            marginBottom: 24,
            textAlign: "left"
          }}
          showAction
        />
        <Title
          text="職缺"
          buttonText="刊登職缺"
          buttonOnClick={() => setFormOpen(true)}
        />
        <div>
          {positions.length !== 0 ? (
            positions.map((value, index) => {
              if (user && user.recruiterInfo && user.recruiterInfo.team)
                value.team = user.recruiterInfo.team;
              return (
                <RecruiterJobCard
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
