import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { Education } from "@frankyjuang/milkapi-client";
import { EducationDialogContent } from "./EducationDialogContent";

interface EducationDialogProps {
  education?: Education;
  isOpen: boolean;
  create: boolean;
  close: () => void;
  update: (Education: Education) => void;
  deleteEducation: (id: string) => void;
}

const EducationDialog: React.FC<EducationDialogProps> = (props) => {
  const { isOpen, close, update, deleteEducation, create, education } = props;

  return (
    <Dialog open={isOpen} onClose={close} fullWidth={true}>
      <DialogTitle>{create ? "新增學歷" : "編輯學歷"}</DialogTitle>
      <EducationDialogContent
        close={close}
        update={update}
        deleteEducation={deleteEducation}
        create={create}
        education={education}
      />
    </Dialog>
  );
};

export { EducationDialog };
