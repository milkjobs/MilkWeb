import {
  DialogContent,
  makeStyles,
  TextField,
  DialogTitle,
} from "@material-ui/core";
import "firebase/auth";
import Recruitement from "assets/recruitement.png";
import Work from "assets/work.png";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import React, { useState } from "react";
import { useAuth } from "stores";
import { useHistory } from "react-router-dom";
import { JobGoalDialogContent } from "components/Profile";
import { JobGoal, Education } from "@frankyjuang/milkapi-client";
import { EducationDialogContent } from "components/Profile/EducationDialogContent";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    marginTop: 24,
    marginLeft: 24,
    marginRight: 24,
    marginBottom: 36,
  },
  selectButton: {
    width: "100%",
    height: 60,
    fontSize: 24,
    borderRadius: 16,
    marginBottom: 8,
  },
  icon: {
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 32,
    marginTop: 32,
  },
}));

interface Props {
  close: () => void;
}

const RegisterContent: React.FC<Props> = ({ close }) => {
  const classes = useStyles();
  const history = useHistory();
  const { user, getApi, reloadUser } = useAuth();
  const [name, setName] = useState<string>();
  const [step, setStep] = useState(0);

  const updateJobGoal = async (updatedJobGoal: JobGoal) => {
    if (user && user.profile && updatedJobGoal.uuid) {
      const jobGoalApi = await getApi("JobGoal");
      await jobGoalApi.updateJobGoal({
        jobGoalId: updatedJobGoal.uuid,
        jobGoal: updatedJobGoal,
      });
      await reloadUser();
    }
  };

  const updateEducation = async (updatedEducation: Education) => {
    if (user && user.profile) {
      const educationApi = await getApi("Education");
      await educationApi.addEducation({
        profileId: user.profile.uuid,
        education: updatedEducation,
      });
      await reloadUser();
    }
  };

  if (step === 0)
    return (
      <>
        <DialogTitle>{"基本資料"}</DialogTitle>
        <DialogContent style={{ height: 80 }}>
          <TextField
            label="姓名"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={async () => {
              if (user && name) {
                setStep(step + 1);
                const userApi = await getApi("User");
                await userApi.updateUser({
                  userId: user?.uuid,
                  user: { ...user, name },
                });
                await reloadUser();
              }
            }}
            variant="contained"
            color="secondary"
          >
            下一步
          </Button>
        </DialogActions>
      </>
    );

  if (step === 1)
    return (
      <>
        <DialogContent
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <img src={Work} className={classes.icon} width={100} height={100} />
          <Button
            variant={"contained"}
            color={"secondary"}
            onClick={() => setStep(step + 1)}
            className={classes.selectButton}
          >
            {"我要找工作"}
          </Button>
          <img
            src={Recruitement}
            className={classes.icon}
            width={100}
            height={100}
          />
          <Button
            variant={"contained"}
            color={"secondary"}
            className={classes.selectButton}
            onClick={() => {
              close();
              history.push("/?createTeam=true");
            }}
          >
            {"我要找人才"}
          </Button>
        </DialogContent>
      </>
    );

  if (step === 2)
    return (
      <>
        <DialogTitle>{"求職目標"}</DialogTitle>
        <JobGoalDialogContent
          close={() => setStep(step + 1)}
          jobGoal={user?.profile?.jobGoal}
          update={updateJobGoal}
          disableCancel
        />
      </>
    );

  if (step === 3)
    return (
      <>
        <DialogTitle>{"學歷"}</DialogTitle>
        <EducationDialogContent
          close={close}
          update={updateEducation}
          create
          disableCancel
          deleteEducation={() => {}}
        />
      </>
    );

  return <div />;
};

export { RegisterContent };
