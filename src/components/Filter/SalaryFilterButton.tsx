import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import { SalaryType } from "@frankyjuang/milkapi-client";
import Slider from "@material-ui/core/Slider";
import { useSearch } from "stores";

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

export interface SalaryDialogProps {
  open: boolean;
  minimumSalary: number;
  maximumSalary: number;
  onClose: (value: number[]) => void;
}

function SalaryDialog(props: SalaryDialogProps) {
  const { onClose, open, minimumSalary, maximumSalary } = props;
  const [value, setValue] = React.useState<number[]>([
    minimumSalary,
    maximumSalary
  ]);

  const handleChange = (event: any, newValue: number | number[]) => {
    console.warn(newValue);
    setValue(newValue as number[]);
  };

  const handleClose = () => {
    onClose(value);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
      fullWidth
    >
      <DialogTitle>{"薪水"}</DialogTitle>
      <Slider
        max={maximumSalary}
        min={minimumSalary}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
      />
    </Dialog>
  );
}

interface SalaryFilterButtonProps {
  salaryType: SalaryType;
}

const SalaryFilterButton: React.FC<SalaryFilterButtonProps> = ({
  salaryType
}) => {
  const classes = useStyles();
  const { setSearchState, searchState } = useSearch();
  const [open, setOpen] = useState(false);
  const [minimumSalary, maximumSalary] =
    salaryType === SalaryType.Hourly ? [158, 1000] : [23800, 200000];

  return (
    <>
      <Button className={classes.filterButton} onClick={() => setOpen(true)}>
        <div className={classes.filterText}>{"薪水"}</div>
      </Button>
      <SalaryDialog
        open={open}
        minimumSalary={minimumSalary}
        maximumSalary={maximumSalary}
        onClose={(salary: number[]) => {
          console.warn(salary);
          setSearchState(prev => {
            return {
              ...prev,
              page: 1,
              range: {
                minSalary: { max: salary[1] },
                maxSalary: { min: salary[0] }
              }
            };
          });
          setOpen(false);
        }}
      />
    </>
  );
};

export { SalaryFilterButton };
