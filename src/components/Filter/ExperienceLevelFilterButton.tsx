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
import { ExperienceLevel } from "@frankyjuang/milkapi-client";

const useStyles = makeStyles(theme => ({
  container: {
    marginHorizontal: 4
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
    marginRight: 8
  },
  filterText: {
    color: theme.palette.text.secondary,
    fontSize: 14
  }
}));

export interface ExperienceLevelDialogProps {
  open: boolean;
  selectedValue: ExperienceLevel;
  onClose: (value: ExperienceLevel) => void;
}

function ExperienceLevelDialog(props: ExperienceLevelDialogProps) {
  const { onClose, selectedValue, open } = props;
  const [value, setValue] = React.useState<ExperienceLevel>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value as ExperienceLevel);
    onClose((event.target as HTMLInputElement).value as ExperienceLevel);
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
      <DialogTitle>{"經驗要求"}</DialogTitle>
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
            value={ExperienceLevel.Any}
            control={<Radio />}
            label="不限"
          />
          <FormControlLabel
            value={ExperienceLevel.Entry}
            control={<Radio />}
            label="入門"
          />
          <FormControlLabel
            value={ExperienceLevel.Mid}
            control={<Radio />}
            label="中階"
          />
          <FormControlLabel
            value={ExperienceLevel.Senior}
            control={<Radio />}
            label="資深"
          />
        </RadioGroup>
      </FormControl>
    </Dialog>
  );
}

const ExperienceLevelFilterButton: React.FC<RefinementListProvided> = ({
  refine
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(ExperienceLevel.Any);

  const ExperienceLevelDisplay = (type: string) => {
    if (type === ExperienceLevel.Any) return "經驗";
    if (type === ExperienceLevel.Entry) return "入門";
    if (type === ExperienceLevel.Mid) return "中階";
    if (type === ExperienceLevel.Senior) return "資深";
  };

  return (
    <>
      <Button className={classes.filterButton} onClick={() => setOpen(true)}>
        <div className={classes.filterText}>
          {ExperienceLevelDisplay(selectedValue)}
        </div>
      </Button>
      <ExperienceLevelDialog
        open={open}
        onClose={(value: ExperienceLevel) => {
          refine(
            value === ExperienceLevel.Any
              ? [
                  ExperienceLevel.Any,
                  ExperienceLevel.Entry,
                  ExperienceLevel.Mid,
                  ExperienceLevel.Senior
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

const ConnectedExperienceLevelFilterButton = connectRefinementList(
  ExperienceLevelFilterButton
);

export { ConnectedExperienceLevelFilterButton as ExperienceLevelFilterButton };
