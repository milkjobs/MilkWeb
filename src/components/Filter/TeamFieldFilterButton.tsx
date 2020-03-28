import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { RefinementListProvided, Hit } from "react-instantsearch-core";
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

export interface TeamFieldDialogProps {
  open: boolean;
  items: Hit<{
    count: number;
    isRefined: boolean;
    label: string;
    value: string[];
  }>[];
  selectedValue: string | undefined;
  onClose: (value: string) => void;
}

function TeamFieldDialog(props: TeamFieldDialogProps) {
  const { onClose, selectedValue, open, items } = props;
  const [value, setValue] = React.useState<string | undefined>(selectedValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value as EducationLevel);
    onClose((event.target as HTMLInputElement).value as EducationLevel);
  };

  const handleClose = () => {
    selectedValue && onClose(selectedValue);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
      fullWidth
    >
      <DialogTitle>{"產業"}</DialogTitle>
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
            value={undefined}
            control={<Radio />}
            label={"不限"}
          />
          {items.map(i => (
            <FormControlLabel
              key={i.objectID}
              value={i.label}
              control={<Radio />}
              label={i.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Dialog>
  );
}

const TeamFieldFilterButton: React.FC<RefinementListProvided> = ({
  refine,
  items
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>();

  return (
    <>
      <Button className={classes.filterButton} onClick={() => setOpen(true)}>
        <div className={classes.filterText}>{selectedValue || "產業"}</div>
      </Button>
      <TeamFieldDialog
        open={open}
        items={items}
        onClose={value => {
          refine([value]);
          setOpen(false);
          setSelectedValue(value);
        }}
        selectedValue={selectedValue}
      />
    </>
  );
};

const ConnectedTeamFieldFilterButton = connectRefinementList(
  TeamFieldFilterButton
);

export { ConnectedTeamFieldFilterButton as TeamFieldFilterButton };
