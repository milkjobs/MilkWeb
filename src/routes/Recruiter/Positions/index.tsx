import { Job } from "@frankyjuang/milkapi-client";
import { makeStyles, Button } from "@material-ui/core";
import { Header } from "components/Header";
import { JobCreateForm, PositionCard } from "components/Job";
import { Title } from "components/Util";
import { VerificationStateBanner } from "components/Verification";
import React, { useEffect, useState } from "react";
import { useAuth } from "stores";
import { EmailForm } from "components/Profile";
import { TeamCard } from "components/TeamComponents";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper,
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    marginBottom: 100,
    marginTop: 40,
    paddingLeft: 24,
    paddingRight: 24,
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up("lg")]: {
      marginRight: "auto",
      marginLeft: "auto",
    },
    [theme.breakpoints.only("md")]: {
      width: "100%",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      marginTop: 8,
      marginBottom: 8,
    },
  },
  positionsContainer: {
    display: "flex",
    justifyContent: "center",
    paddingRight: 24,
    paddingLeft: 24,
    flexDirection: "column",
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up("lg")]: {
      width: "960px",
    },
    [theme.breakpoints.only("md")]: {
      flex: 3,
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  teamCardContainer: {
    [theme.breakpoints.up("lg")]: {
      minWidth: "250px",
    },
    [theme.breakpoints.only("md")]: {
      flex: 1,
    },
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  emailContainer: {
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 60,
    [theme.breakpoints.up("md")]: {
      width: "600px",
    },
    padding: 24,
    borderRadius: 8,
    backgroundColor: theme.palette.action.hover,
  },
  emailHint: {
    fontSize: 16,
  },
  emailForm: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const Positions: React.FC = () => {
  const classes = useStyles();
  const { user, getApi, reloadUser } = useAuth();
  const [positions, setPositions] = useState<Job[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [downloadAppOpen, setDownloadAppOpen] = useState(false);

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
        <div className={classes.positionsContainer}>
          <VerificationStateBanner
            containerStyle={{
              marginBottom: 24,
              textAlign: "left",
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
                  <PositionCard
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
        <div className={classes.teamCardContainer}>
          <TeamCard />
        </div>
      </div>
      <EmailForm />
    </div>
  );
};

export default Positions;
