import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React, { useEffect, useState } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import { Education } from "@frankyjuang/milkapi-client";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import { zhTW } from "date-fns/locale";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import ChipInput from "material-ui-chip-input";

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

interface EducationDialogContentProps {
  education?: Education;
  disableCancel?: boolean;
  create: boolean;
  close: () => void;
  update: (Education: Education) => void;
  deleteEducation: (id: string) => void;
}

const EducationDialogContent: React.FC<EducationDialogContentProps> = (
  props
) => {
  const {
    close,
    update,
    deleteEducation,
    create,
    education,
    disableCancel,
  } = props;
  const classes = useStyles();
  const [schoolName, setSchoolName] = useState<string>();
  const [degree, setDegree] = useState<string>();
  const [majorName, setMajorName] = useState<string>();
  const [startTime, setStartTime] = React.useState<Date | null>(new Date());
  const [current, setCurrent] = React.useState<boolean>(true);
  const [endTime, setEndTime] = React.useState<Date | null>(null);
  const [skillTags, setSkillTags] = useState<string[]>([]);
  const [description, setDescription] = useState<string>();
  const [schoolNameErrorMessage, setSchoolNameErrorMessage] = useState<
    string
  >();
  const [degreeErrorMessage, setDegreeErrorMessage] = useState<string>();
  const [majorNameErrorMessage, setMajorNameErrorMessage] = useState<string>();
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState<
    string
  >();

  useEffect(() => {
    setSchoolName(education ? education.schoolName : undefined);
    setDegree(education ? education.degree : undefined);
    setMajorName(education ? education.majorName : undefined);
    setStartTime(education ? education.startTime : new Date());
    setEndTime(education ? education.endTime || null : null);
    setDescription(education ? education.description : undefined);
    setSkillTags(education ? education.skillTags : []);
    education && !education.endTime && setCurrent(true);
    !education && setCurrent(true);
  }, [education]);

  const handleSchoolNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.value.length > 100) {
      setSchoolNameErrorMessage("職位名稱不能超過 100 個字");
      return;
    }
    setSchoolName(event.target.value);
    setSchoolNameErrorMessage(undefined);
  };

  const handleDegreeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDegree(event.target.value as string);
    setDegreeErrorMessage(undefined);
  };

  const handleMajorNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.value.length > 100) {
      setMajorNameErrorMessage("科系不能超過 100 個字");
      return;
    }
    setMajorName(event.target.value);
    setMajorNameErrorMessage(undefined);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.value.length > 2000) {
      setDescriptionErrorMessage("自我介紹長度不能超過 2000 個字");
      return;
    }
    setDescription(event.target.value);
    setDescriptionErrorMessage(undefined);
  };

  const handleStartTimeChange = (date: Date | null) => {
    setStartTime(date);
  };

  const handleCurrentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrent(event.target.checked);
  };

  const handleEndTimeChange = (date: Date | null) => {
    setEndTime(date);
  };

  const checkSchoolName = () => {
    const helperText = !schoolName ? "學校名稱不得為空" : undefined;
    setSchoolNameErrorMessage(helperText);

    return !helperText;
  };

  const checkMajor = () => {
    const helperText = !majorName ? "科系不得為空" : undefined;
    setMajorNameErrorMessage(helperText);

    return !helperText;
  };

  return (
    <>
      <DialogContent>
        <TextField
          autoFocus
          className={classes.formTextInput}
          error={!!schoolNameErrorMessage}
          fullWidth
          helperText={schoolNameErrorMessage || ""}
          id="name"
          label="學校名稱"
          margin="normal"
          onBlur={checkSchoolName}
          onChange={handleSchoolNameChange}
          value={schoolName}
        />
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">學位</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={degree}
            onChange={handleDegreeChange}
          >
            <MenuItem value={"高中"}>高中</MenuItem>
            <MenuItem value={"大學"}>大學</MenuItem>
            <MenuItem value={"大專"}>大專</MenuItem>
            <MenuItem value={"碩士"}>碩士</MenuItem>
            <MenuItem value={"博士"}>博士</MenuItem>
          </Select>
        </FormControl>
        <TextField
          className={classes.formTextInput}
          error={!!majorNameErrorMessage}
          fullWidth
          helperText={majorNameErrorMessage || ""}
          id="name"
          label="科系"
          margin="normal"
          onBlur={checkMajor}
          onChange={handleMajorNameChange}
          value={majorName}
        />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container>
            <KeyboardDatePicker
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="開始時間"
              value={startTime}
              onChange={handleStartTimeChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: 24,
                marginLeft: 16,
              }}
            >
              <Checkbox checked={current} onChange={handleCurrentChange} />
              <div>{"至今"}</div>
            </div>
          </Grid>
        </MuiPickersUtilsProvider>
        {!current && (
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={zhTW}>
            <Grid container justify="space-between">
              <KeyboardDatePicker
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="結束時間"
                value={endTime}
                onChange={handleEndTimeChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
        )}
        <TextField
          error={!!descriptionErrorMessage}
          fullWidth
          helperText={descriptionErrorMessage || ""}
          id="introduction"
          label="介紹"
          margin="normal"
          multiline
          onBlur={() => setDescriptionErrorMessage(undefined)}
          onChange={handleDescriptionChange}
          rows="8"
          value={description}
        />
        <ChipInput
          fullWidth
          value={skillTags}
          onChange={(chips) => setSkillTags(chips)}
          onDelete={(chip) => setSkillTags(skillTags.filter((t) => t !== chip))}
          margin="normal"
          label={"技能標籤"}
        />
      </DialogContent>
      <DialogActions>
        {!create && (
          <Button
            style={{ marginRight: "auto" }}
            onClick={() => {
              education && education.uuid && deleteEducation(education.uuid);
              close();
            }}
            color="secondary"
            variant="text"
          >
            刪除
          </Button>
        )}
        {!disableCancel && (
          <Button onClick={close} color="primary" variant="text">
            取消
          </Button>
        )}
        <Button
          onClick={() => {
            schoolName &&
              degree &&
              majorName &&
              startTime &&
              skillTags &&
              update({
                uuid: education?.uuid,
                schoolName,
                degree,
                majorName,
                startTime,
                endTime,
                description,
                skillTags,
              });
            close();
          }}
          color="primary"
          disabled={!schoolName || !majorName || !startTime || !degree}
          variant="text"
        >
          {create ? "新增" : "儲存"}
        </Button>
      </DialogActions>
    </>
  );
};

export { EducationDialogContent };
