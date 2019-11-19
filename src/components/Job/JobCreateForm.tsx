import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import MenuItem from "@material-ui/core/MenuItem";
import DialogTitle from "@material-ui/core/DialogTitle";
import { createStyles, makeStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core";

interface JobCreateFormProps {
  open: boolean;
  handleClose: () => void;
}

const JobTypes = [
  {
    value: "fulltime",
    label: "正職"
  },
  {
    value: "internship",
    label: "實習"
  }
];

const JobCreateForm: React.FC<JobCreateFormProps> = ({ open, handleClose }) => {
  const classes = useStyles();
  const [jobType, setJobType] = useState("");
  const [area, setArea] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJobType(event.target.value);
  };
  return (
    <div>
      <Dialog
        maxWidth={"sm"}
        fullWidth
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">發布職缺</DialogTitle>
        <DialogContent>
          <TextField
            id="standard-select-currency"
            autoFocus
            select
            fullWidth
            label="類型"
            value={jobType}
            onChange={handleChange}
            SelectProps={{
              MenuProps: {
                className: classes.menu
              }
            }}
            margin="normal"
          >
            {JobTypes.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField margin="normal" id="name" label="名稱" fullWidth />
          <TextField
            id="standard-select-currency"
            select
            fullWidth
            label="地區"
            value={area}
            onChange={handleChange}
            SelectProps={{
              MenuProps: {
                className: classes.menu
              }
            }}
            margin="normal"
          >
            {JobTypes.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField margin="normal" id="name" label="地址" fullWidth />
          <TextField
            id="standard-select-currency"
            select
            fullWidth
            label="薪水"
            value={area}
            onChange={handleChange}
            SelectProps={{
              MenuProps: {
                className: classes.menu
              }
            }}
            margin="normal"
          >
            {JobTypes.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="standard-select-currency"
            select
            fullWidth
            label="學歷要求"
            value={area}
            onChange={handleChange}
            SelectProps={{
              MenuProps: {
                className: classes.menu
              }
            }}
            margin="normal"
          >
            {JobTypes.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="standard-select-currency"
            select
            fullWidth
            label="經驗要求"
            value={area}
            onChange={handleChange}
            SelectProps={{
              MenuProps: {
                className: classes.menu
              }
            }}
            margin="normal"
          >
            {JobTypes.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="normal"
            id="name"
            label="介紹"
            multiline
            rows="10"
            rowsMax="10"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            取消
          </Button>
          <Button onClick={handleClose} color="primary">
            發布
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexWrap: "wrap"
    },
    menu: {
      width: 200
    }
  })
);

export { JobCreateForm };
