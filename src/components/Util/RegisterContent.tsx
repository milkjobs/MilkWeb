import {
  DialogContent,
  InputAdornment,
  makeStyles,
  TextField,
  useMediaQuery,
  useTheme,
  DialogTitle,
} from "@material-ui/core";
import "firebase/auth";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import React, { useCallback, useEffect, useState } from "react";
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
            height: 300,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Button
            variant={"contained"}
            color={"secondary"}
            onClick={() => setStep(step + 1)}
            className={classes.selectButton}
          >
            {"我要找工作"}
          </Button>
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
