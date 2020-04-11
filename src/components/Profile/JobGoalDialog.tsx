import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React, { useEffect, useState } from "react";
import { JobGoal } from "@frankyjuang/milkapi-client";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { TaiwanAreaJSON } from "config";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    display: "flex",
    flexWrap: "wrap",
    marginTop: 8,
  },
  formControl: {
    marginRight: theme.spacing(2),
    minWidth: 115,
  },
  formTextInput: {
    marginBottom: 12,
  },
}));

interface JobGoalDialogProps {
  jobGoal?: JobGoal;
  isOpen: boolean;
  create: boolean;
  close: () => void;
  update: (jobGoal: JobGoal) => void;
  deleteJobGoal: (id: string) => void;
}

const JobGoalDialog: React.FC<JobGoalDialogProps> = (props) => {
  const { isOpen, close, update, deleteJobGoal, create, jobGoal } = props;
  const classes = useStyles();
  const [name, setName] = useState<string>();
  const [area, setArea] = useState<string>();
  const [salary, setSalary] = useState<string>();
  const [nameErrorMessage, setNameErrorMessage] = useState<string>();
  const [areaErrorMessage, setAreaErrorMessage] = useState<string | undefined>(
    "地點不得為空"
  );
  const [salaryErrorMessage, setSalaryErrorMessage] = useState<string>();

  useEffect(() => {
    setName(jobGoal ? jobGoal.name : undefined);
    setSalary(jobGoal ? jobGoal.salary : undefined);
  }, [jobGoal]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 100) {
      setNameErrorMessage("職位名稱不能超過 100 個字");
      return;
    }
    setName(event.target.value);
    setNameErrorMessage(undefined);
  };

  const handleSalaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 100) {
      setSalaryErrorMessage("期望薪水不能超過 2000 個字");
      return;
    }
    setSalary(event.target.value);
    setSalaryErrorMessage(undefined);
  };

  const handleAreaChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setArea(event.target.value as string);
    setAreaErrorMessage(undefined);
  };

  const checkName = () => {
    const helperText = !name ? "職缺名稱不得為空" : undefined;
    setNameErrorMessage(helperText);

    return !helperText;
  };

  const checkArea = () => {
    const helperText = !area ? "地點不得為空" : undefined;
    setAreaErrorMessage(helperText);

    return !helperText;
  };

  return (
    <Dialog open={isOpen} onClose={close} fullWidth={true}>
      <DialogTitle>{create ? "新增求職目標" : "編輯求職目標"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          className={classes.formTextInput}
          error={!!nameErrorMessage}
          fullWidth
          helperText={nameErrorMessage || ""}
          id="name"
          label="職缺名稱"
          margin="normal"
          onBlur={checkName}
          onChange={handleNameChange}
          value={name}
        />
        <FormControl className={classes.formControl} error={!!areaErrorMessage}>
          <InputLabel id="demo-simple-select-label">地點</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={area}
            onChange={handleAreaChange}
          >
            {TaiwanAreaJSON.map((a) => (
              <MenuItem key={a.name} value={a.name}>
                {a.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{areaErrorMessage}</FormHelperText>
        </FormControl>
        <TextField
          error={!!salaryErrorMessage}
          fullWidth
          helperText={salaryErrorMessage || ""}
          id="introduction"
          label="期望薪水"
          margin="normal"
          onBlur={() => setSalaryErrorMessage(undefined)}
          onChange={handleSalaryChange}
          value={salary}
        />
      </DialogContent>
      <DialogActions>
        {!create && (
          <Button
            style={{ marginRight: "auto" }}
            onClick={() => {
              jobGoal && jobGoal.uuid && deleteJobGoal(jobGoal.uuid);
              close();
            }}
            color="secondary"
            variant="text"
          >
            刪除
          </Button>
        )}
        <Button onClick={close} color="primary" variant="text">
          取消
        </Button>
        <Button
          onClick={() => {
            name &&
              area &&
              salary &&
              update({
                uuid: jobGoal?.uuid,
                address: { area, subArea: "不限" },
                name,
                salary,
              });
            close();
          }}
          color="primary"
          disabled={!name || !area || !salary}
          variant="text"
        >
          {create ? "新增" : "儲存"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { JobGoalDialog };
