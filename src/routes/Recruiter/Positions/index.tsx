import { Job } from "@frankyjuang/milkapi-client";
import { makeStyles, Button } from "@material-ui/core";
import { Header } from "components/Header";
import { JobCreateForm, PositionCard } from "components/Job";
import { Title } from "components/Util";
import { VerificationStateBanner } from "components/Verification";
import React, { useEffect, useState } from "react";
import { useAuth } from "stores";
import { DownloadApp } from "components/Util";
import TextField from "@material-ui/core/TextField";
import { EmailForm } from "components/Profile";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper,
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
      width: "960px",
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
  const [email, setEmail] = useState<string | undefined>(
    user?.recruiterInfo?.email
  );
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>();

  const resendVerificationEmail = async () => {
    if (emailErrorMessage) {
      return;
    }
    const recruiterInfoApi = await getApi("RecruiterInfo");

    if (user?.recruiterInfo?.uuid && email !== user.recruiterInfo.email) {
      await recruiterInfoApi.updateRecruiterInfo({
        recruiterInfoId: user.recruiterInfo.uuid,
        recruiterInfo: {
          ...user.recruiterInfo,
          email,
        },
      });
    }
    user?.recruiterInfo?.uuid &&
      (await recruiterInfoApi.resendEmailConfirmation({
        recruiterInfoId: user?.recruiterInfo?.uuid,
      }));
    await reloadUser();
  };

  const saveEmail = async () => {
    if (emailErrorMessage) {
      return;
    }

    if (user?.recruiterInfo?.uuid && email) {
      const recruiterInfoApi = await getApi("RecruiterInfo");
      await recruiterInfoApi.updateRecruiterInfo({
        recruiterInfoId: user.recruiterInfo.uuid,
        recruiterInfo: {
          ...user.recruiterInfo,
          email,
        },
      });
    }
    await reloadUser();
  };

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
      <EmailForm />
    </div>
  );
};

export default Positions;
