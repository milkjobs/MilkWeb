import { JobGoal } from "@frankyjuang/milkapi-client";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import React from "react";
import { JobGoalDialogContent } from "./JobGoalDialogContent";

interface JobGoalDialogProps {
  jobGoal?: JobGoal;
  isOpen: boolean;
  close: () => void;
  update: (jobGoal: JobGoal) => void;
}

const JobGoalDialog: React.FC<JobGoalDialogProps> = (props) => {
  const { isOpen, close, update, jobGoal } = props;
  return (
    <Dialog open={isOpen} onClose={close} fullWidth={true}>
      <DialogTitle>編輯求職目標</DialogTitle>
      <JobGoalDialogContent close={close} jobGoal={jobGoal} update={update} />
    </Dialog>
  );
};

export { JobGoalDialog };
