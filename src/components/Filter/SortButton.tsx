import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { RefinementListProvided, Hit } from "react-instantsearch-core";
import { connectSortBy } from "react-instantsearch-dom";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { EducationLevel } from "@frankyjuang/milkapi-client";

const useStyles = makeStyles((theme) => ({
  container: {
    marginHorizontal: 4,
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
    marginRight: 8,
  },
  filterText: {
    color: theme.palette.text.secondary,
    fontSize: 14,
  },
}));

export interface SortItemsDialogProps {
  open: boolean;
  items: Hit<{
    count: number;
    isRefined: boolean;
    label: string;
    value: string[];
  }>[];
  selectedValue: string | undefined;
  onClose: (value: string | undefined) => void;
}

function SortItemsDialog(props: SortItemsDialogProps) {
  const { onClose, selectedValue, open, items } = props;
  const [value, setValue] = React.useState<string | undefined>(selectedValue);

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
      <DialogTitle>{"排序"}</DialogTitle>
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
          {items.map((i) => (
            <FormControlLabel
              key={i.objectID}
              value={i.value}
              control={<Radio />}
              label={i.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Dialog>
  );
}

const SortButton: React.FC<any> = ({ refine, items }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>();

  return (
    <>
      <Button className={classes.filterButton} onClick={() => setOpen(true)}>
        <div className={classes.filterText}>{selectedValue || "排序"}</div>
      </Button>
      <SortItemsDialog
        open={open}
        items={items}
        onClose={(value) => {
          console.warn(value);
          refine(value ? value : "");
          setOpen(false);
          setSelectedValue(value);
        }}
        selectedValue={selectedValue}
      />
    </>
  );
};

const ConnectedSortButton = connectSortBy(SortButton);

export { ConnectedSortButton as SortButton };
