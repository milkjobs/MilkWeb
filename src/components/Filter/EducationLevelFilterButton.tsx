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
import { EducationLevel } from "@frankyjuang/milkapi-client";

const useStyles = makeStyles(theme => ({
  container: {
    marginHorizontal: 4
  },
  filterButton: {
    minWidth: 60,
    borderColor: theme.palette.divider,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "solid",
    justifyContent: "center",
    paddingHorizontal: 12,
    marginBottom: 8,
    marginRight: 8
  },
  filterText: {
    color: theme.palette.text.secondary,
    fontSize: 14
  }
}));

export interface EducationLevelDialogProps {
  open: boolean;
  selectedValue: EducationLevel;
  onClose: (value: EducationLevel) => void;
}

function EducationLevelDialog(props: EducationLevelDialogProps) {
  const { onClose, selectedValue, open } = props;
  const [value, setValue] = React.useState<EducationLevel>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value as EducationLevel);
    onClose((event.target as HTMLInputElement).value as EducationLevel);
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
      <DialogTitle>{"學歷要求"}</DialogTitle>
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
          <FormControlLabel
            value={EducationLevel.Any}
            control={<Radio />}
            label="不限"
          />
          <FormControlLabel
            value={EducationLevel.HighSchool}
            control={<Radio />}
            label="高中 / 高職"
          />
          <FormControlLabel
            value={EducationLevel.Bachelor}
            control={<Radio />}
            label="大學 / 專科"
          />
          <FormControlLabel
            value={EducationLevel.Master}
            control={<Radio />}
            label="碩士"
          />
          <FormControlLabel
            value={EducationLevel.PhD}
            control={<Radio />}
            label="博士"
          />
        </RadioGroup>
      </FormControl>
    </Dialog>
  );
}

const EducationLevelFilterButton: React.FC<RefinementListProvided> = ({
  refine
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(EducationLevel.Any);

  const EducationLevelDisplay = (type: string) => {
    if (type === EducationLevel.Any) return "學歷";
    if (type === EducationLevel.HighSchool) return "高中 / 高職";
    if (type === EducationLevel.Bachelor) return "大學 / 專科";
    if (type === EducationLevel.Master) return "碩士";
    if (type === EducationLevel.PhD) return "博士";
  };

  return (
    <>
      <Button className={classes.filterButton} onClick={() => setOpen(true)}>
        <div className={classes.filterText}>
          {EducationLevelDisplay(selectedValue)}
        </div>
      </Button>
      <EducationLevelDialog
        open={open}
        onClose={(value: EducationLevel) => {
          refine(
            value === EducationLevel.Any
              ? [
                  EducationLevel.Any,
                  EducationLevel.HighSchool,
                  EducationLevel.Bachelor,
                  EducationLevel.Master,
                  EducationLevel.PhD
                ]
              : [value]
          );
          setOpen(false);
          setSelectedValue(value);
        }}
        selectedValue={selectedValue}
      />
    </>
  );
};

const ConnectedEducationLevelFilterButton = connectRefinementList(
  EducationLevelFilterButton
);

export { ConnectedEducationLevelFilterButton as EducationLevelFilterButton };
