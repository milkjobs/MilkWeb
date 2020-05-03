import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { RefinementListProvided } from "react-instantsearch-core";
import { connectRefinementList } from "react-instantsearch-dom";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { JobType } from "@frankyjuang/milkapi-client";

const useStyles = makeStyles((theme) => ({
  container: {
    marginHorizontal: 4,
  },
  filterButton: {
    width: 60,
    borderColor: theme.palette.divider,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "solid",
    justifyContent: "center",
    paddingHorizontal: 12,
    marginBottom: 8,
    marginRight: 8,
  },
  filterText: {
    color: theme.palette.text.secondary,
    fontSize: 14,
  },
}));

export interface JobTypeDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

function JobTypeDialog(props: JobTypeDialogProps) {
  const { onClose, selectedValue, open } = props;
  const [value, setValue] = React.useState<string>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    onClose((event.target as HTMLInputElement).value);
  };

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
      fullWidth
    >
      <DialogTitle>{"類型"}</DialogTitle>
      <FormControl
        component="fieldset"
        style={{ paddingLeft: 32, paddingBottom: 16 }}
      >
        <RadioGroup
          aria-label="gender"
          name="gender1"
          value={value}
          onChange={handleChange}
        >
          <FormControlLabel value={""} control={<Radio />} label="全部" />
          <FormControlLabel
            value={JobType.Fulltime}
            control={<Radio />}
            label="正職"
          />
          <FormControlLabel
            value={JobType.Internship}
            control={<Radio />}
            label="實習"
          />
          <FormControlLabel
            value={JobType.Parttime}
            control={<Radio />}
            label="兼職"
          />
        </RadioGroup>
      </FormControl>
    </Dialog>
  );
}

interface JobTypeFilterButtonProps extends RefinementListProvided {
  onChange: (type: JobType) => void;
}

const JobTypeFilterButton: React.FC<JobTypeFilterButtonProps> = ({
  refine,
  onChange,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const jobTypeDisplay = (type: string) => {
    if (type === JobType.Fulltime) return "正職";
    if (type === JobType.Internship) return "實習";
    if (type === JobType.Parttime) return "兼職";
  };

  return (
    <>
      <Button className={classes.filterButton} onClick={() => setOpen(true)}>
        <div className={classes.filterText}>
          {jobTypeDisplay(selectedValue) || "類型"}
        </div>
      </Button>
      <JobTypeDialog
        open={open}
        onClose={(value: string) => {
          refine([value]);
          setOpen(false);
          onChange(value as JobType);
          setSelectedValue(value);
        }}
        selectedValue={selectedValue}
      />
    </>
  );
};

const ConnectedJobTypeFilterButton = connectRefinementList(JobTypeFilterButton);

export { ConnectedJobTypeFilterButton as JobTypeFilterButton };
