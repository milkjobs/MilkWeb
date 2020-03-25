import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import to from "await-to-js";
import { ImageMimeType } from "helpers";
import React, { useCallback, useEffect, useState } from "react";
import { Slide, toast, ToastContainer, ToastPosition } from "react-toastify";
import { useAuth } from "stores";
import Checkbox from "@material-ui/core/Checkbox";
import moment from "moment";
import { Experience, Education } from "@frankyjuang/milkapi-client";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import { zhTW } from "date-fns/locale";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: 12,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 16,
    marginBottom: 8,
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.up("sm")]: {
      width: "600px"
    }
  },
  info: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 24
  },
  name: {
    fontSize: 30,
    fontWeight: "bold",
    color: theme.palette.text.primary
  },
  detail: {
    display: "flex",
    flex: 1,
    fontSize: 16,
    color: "#4A4A4A"
  },
  description: {
    display: "flex",
    whiteSpace: "pre-line",
    textAlign: "left",
    flex: 1,
    fontSize: 16,
    marginTop: 32,
    color: theme.palette.text.secondary
  },
  items: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    flex: 1,
    marginTop: 32
  },
  title: {
    display: "flex",
    whiteSpace: "pre-line",
    textAlign: "left",
    flex: 1,
    fontSize: 20,
    color: theme.palette.text.primary
  },
  block: {
    marginTop: 16,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: theme.palette.divider,
    "&:hover": {
      cursor: "pointer",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1) !important"
    }
  },
  blockTitle: {
    fontSize: 18,
    color: theme.palette.text.secondary
  },
  blockRow: {
    display: "flex",
    justifyContent: "space-between"
  },
  blockPeriod: {
    fontSize: 18,
    color: theme.palette.text.secondary
  },
  blockDescription: {
    marginTop: 8,
    fontSize: 18,
    color: theme.palette.text.secondary
  },
  blockAdd: {
    color: theme.palette.secondary.main,
    margin: 8,
    padding: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    "&:hover": {
      cursor: "pointer",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1) !important"
    }
  },
  button: {
    marginLeft: theme.spacing(2)
  },
  formContainer: {
    display: "flex",
    flexWrap: "wrap",
    marginTop: 8
  },
  formControl: {
    marginRight: theme.spacing(2),
    minWidth: 115
  },
  formTextInput: {
    marginBottom: 12
  }
}));

const ExperienceBlock: React.FC<Experience> = props => {
  const { jobName, teamName, startTime, endTime, description } = props;
  const classes = useStyles();
  return (
    <div className={classes.block}>
      <div className={classes.blockRow}>
        <div className={classes.blockTitle}>{jobName + "・" + teamName}</div>
        <div className={classes.blockPeriod}>
          {moment(startTime).calendar(undefined, {
            sameDay: "MM/YYYY",
            nextDay: "MM/YYYY",
            nextWeek: "MM/YYYY",
            lastDay: "MM/YYYY",
            lastWeek: "MM/YYYY",
            sameElse: "MM/YYYY"
          }) +
            " ~ " +
            (endTime
              ? moment(endTime).calendar(undefined, {
                  sameDay: "MM/YYYY",
                  nextDay: "MM/YYYY",
                  nextWeek: "MM/YYYY",
                  lastDay: "MM/YYYY",
                  lastWeek: "MM/YYYY",
                  sameElse: "MM/YYYY"
                })
              : "至今")}
        </div>
      </div>
      <div className={classes.blockDescription}>{description}</div>
    </div>
  );
};

const EducationBlock: React.FC<Education> = props => {
  const {
    schoolName,
    degree,
    majorName,
    startTime,
    endTime,
    description
  } = props;
  const classes = useStyles();
  return (
    <div className={classes.block}>
      <div className={classes.blockRow}>
        <div className={classes.blockTitle}>
          {schoolName + "・" + degree + "・" + majorName}
        </div>
        <div className={classes.blockPeriod}>
          {moment(startTime).calendar(undefined, {
            sameDay: "MM/YYYY",
            nextDay: "MM/YYYY",
            nextWeek: "MM/YYYY",
            lastDay: "MM/YYYY",
            lastWeek: "MM/YYYY",
            sameElse: "MM/YYYY"
          }) +
            " ~ " +
            (endTime
              ? moment(endTime).calendar(undefined, {
                  sameDay: "MM/YYYY",
                  nextDay: "MM/YYYY",
                  nextWeek: "MM/YYYY",
                  lastDay: "MM/YYYY",
                  lastWeek: "MM/YYYY",
                  sameElse: "MM/YYYY"
                })
              : "至今")}
        </div>
      </div>
      <div className={classes.blockDescription}>{description}</div>
    </div>
  );
};

interface DialogProps {
  isOpen: boolean;
  close: () => void;
}

const EditDialog: React.FC<DialogProps> = props => {
  const { isOpen, close } = props;
  const classes = useStyles();
  const { getApi, reloadUser, user } = useAuth();
  const [name, setName] = useState<string>();
  const [introduction, setIntroduction] = useState<string>();
  const [nameErrorMessage, setNameErrorMessage] = useState<string>();
  const [introductionErrorMessage, setIntroductionErrorMessage] = useState<
    string
  >();

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 20) {
      setNameErrorMessage("姓名長度不能超過 20 個字");
      return;
    }
    setName(event.target.value);
    setNameErrorMessage(undefined);
  };

  const handleIntroductionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.value.length > 2000) {
      setIntroductionErrorMessage("自我介紹長度不能超過 2000 個字");
      return;
    }
    setIntroduction(event.target.value);
    setIntroductionErrorMessage(undefined);
  };

  const checkName = () => {
    const helperText = !name ? "姓名不得為空" : undefined;
    setNameErrorMessage(helperText);

    return !helperText;
  };

  const saveChanges = async () => {
    if (!checkName() || !name) {
      return;
    }

    let changed = false;
    if (user && user.name !== name) {
      changed = true;
      const userApi = await getApi("User");
      await userApi.updateUser({ userId: user.uuid, user: { ...user, name } });
    }
    if (user && user.profile && user.profile.introduction !== introduction) {
      changed = true;
      const profileApi = await getApi("Profile");
      await profileApi.updateProfile({
        profileId: user.profile.uuid,
        profile: {
          ...user.profile,
          introduction
        }
      });
    }
    changed && (await reloadUser());

    close();
  };

  const uploadProfileImage = useCallback(
    async (files: File[] | FileList) => {
      if (files.length === 0) {
        return;
      }
      if (!user) {
        return;
      }

      const file = files[0];
      if (file.size > 1 * 1024 * 1024) {
        toast.error("檔案過大，大小上限為 1MB");
        return;
      }

      const userApi = await getApi("User");
      const [err] = await to(
        userApi.uploadUserProfileImage({
          userId: user.uuid,
          file,
          filename: file.name
        })
      );
      if (err) {
        toast.error("上傳失敗，請稍後再試");
        return;
      }
      toast.success("上傳成功");
      await reloadUser();
    },
    [getApi, reloadUser, user]
  );

  useEffect(() => {
    if (user) {
      setName(user.name);
      if (user.profile) {
        setIntroduction(user.profile.introduction);
      }
    }
  }, [user]);

  return (
    <Dialog open={isOpen} onClose={close} fullWidth={true}>
      <DialogTitle>編輯個人資料</DialogTitle>
      <DialogContent>
        {user && (
          <div style={{ display: "flex", marginBottom: 24 }}>
            <Avatar
              alt="profile image"
              src={user.profileImageUrl}
              style={{ width: 60, height: 60 }}
            />
            <label>
              <input
                hidden
                accept={ImageMimeType}
                onChange={e => {
                  e.target.files && uploadProfileImage(e.target.files);
                }}
                type="file"
              />
              <Button
                className={classes.button}
                color="primary"
                component="span"
              >
                上傳大頭貼
              </Button>
            </label>
            <ToastContainer
              draggable={false}
              hideProgressBar
              position={ToastPosition.BOTTOM_CENTER}
              transition={Slide}
            />
          </div>
        )}
        <TextField
          autoFocus
          className={classes.formTextInput}
          error={!!nameErrorMessage}
          fullWidth
          helperText={nameErrorMessage || ""}
          id="name"
          label="姓名"
          margin="normal"
          onBlur={checkName}
          onChange={handleNameChange}
          value={name}
        />
        <TextField
          error={!!introductionErrorMessage}
          fullWidth
          helperText={introductionErrorMessage || ""}
          id="introduction"
          label="自我介紹"
          margin="normal"
          multiline
          onBlur={() => setIntroductionErrorMessage(undefined)}
          onChange={handleIntroductionChange}
          rows="4"
          value={introduction}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color="primary" variant="text">
          取消
        </Button>
        <Button onClick={saveChanges} color="primary">
          儲存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface ExperienceDialogProps {
  experience?: Experience;
  isOpen: boolean;
  create: boolean;
  close: () => void;
  update: (Experience: Experience) => void;
  deleteExperience: (id: string) => void;
}

const ExperienceDialog: React.FC<ExperienceDialogProps> = props => {
  const { isOpen, close, update, deleteExperience, create, experience } = props;
  const classes = useStyles();
  const [jobName, setJobName] = useState<string>();
  const [teamName, setTeamName] = useState<string>();
  const [startTime, setStartTime] = React.useState<Date | null>(new Date());
  const [current, setCurrent] = React.useState<boolean>(true);
  const [endTime, setEndTime] = React.useState<Date | null>(null);
  const [description, setDescription] = useState<string>();
  const [jobNameErrorMessage, setJobNameErrorMessage] = useState<string>();
  const [teamNameErrorMessage, setTeamNameErrorMessage] = useState<string>();
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState<
    string
  >();

  useEffect(() => {
    setJobName(experience ? experience.jobName : undefined);
    setTeamName(experience ? experience.teamName : undefined);
    setStartTime(experience ? experience.startTime : new Date());
    setEndTime(experience ? experience.endTime || null : null);
    setDescription(experience ? experience.description : undefined);
    experience && !experience.endTime && setCurrent(true);
    !experience && setCurrent(true);
  }, [experience]);

  const handleJobNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 100) {
      setJobNameErrorMessage("職位名稱不能超過 100 個字");
      return;
    }
    setJobName(event.target.value);
    setJobNameErrorMessage(undefined);
  };

  const handleTeamNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 100) {
      setTeamNameErrorMessage("公司名稱不能超過 100 個字");
      return;
    }
    setTeamName(event.target.value);
    setTeamNameErrorMessage(undefined);
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

  const checkJobName = () => {
    const helperText = !jobName ? "職位名稱不得為空" : undefined;
    setJobNameErrorMessage(helperText);

    return !helperText;
  };

  const checkTeamName = () => {
    const helperText = !teamName ? "公司名稱不得為空" : undefined;
    setTeamNameErrorMessage(helperText);

    return !helperText;
  };

  return (
    <Dialog open={isOpen} onClose={close} fullWidth={true}>
      <DialogTitle>{create ? "新增經驗" : "編輯經驗"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          className={classes.formTextInput}
          error={!!jobNameErrorMessage}
          fullWidth
          helperText={jobNameErrorMessage || ""}
          id="name"
          label="職位名稱"
          margin="normal"
          onBlur={checkJobName}
          onChange={handleJobNameChange}
          value={jobName}
        />
        <TextField
          className={classes.formTextInput}
          error={!!teamNameErrorMessage}
          fullWidth
          helperText={teamNameErrorMessage || ""}
          id="name"
          label="公司名稱"
          margin="normal"
          onBlur={checkTeamName}
          onChange={handleTeamNameChange}
          value={teamName}
        />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="開始時間"
              value={startTime}
              onChange={handleStartTimeChange}
              KeyboardButtonProps={{
                "aria-label": "change date"
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: 24,
                marginLeft: 16
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
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="結束時間"
                value={endTime}
                onChange={handleEndTimeChange}
                KeyboardButtonProps={{
                  "aria-label": "change date"
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
      </DialogContent>
      <DialogActions>
        {!create && (
          <Button
            style={{ marginRight: "auto" }}
            onClick={() => {
              experience &&
                experience.uuid &&
                deleteExperience(experience.uuid);
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
            jobName &&
              teamName &&
              startTime &&
              update({
                uuid: experience?.uuid,
                jobName,
                teamName,
                startTime,
                endTime,
                description,
                skillTags: []
              });
            close();
          }}
          color="primary"
          disabled={!jobName || !teamName || !startTime}
          variant="text"
        >
          {create ? "新增" : "儲存"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface EducationDialogProps {
  education?: Education;
  isOpen: boolean;
  create: boolean;
  close: () => void;
  update: (Education: Education) => void;
  deleteEducation: (id: string) => void;
}

const EducationDialog: React.FC<EducationDialogProps> = props => {
  const { isOpen, close, update, deleteEducation, create, education } = props;
  const classes = useStyles();
  const [schoolName, setSchoolName] = useState<string>();
  const [degree, setDegree] = useState<string>();
  const [majorName, setMajorName] = useState<string>();
  const [startTime, setStartTime] = React.useState<Date | null>(new Date());
  const [current, setCurrent] = React.useState<boolean>(true);
  const [endTime, setEndTime] = React.useState<Date | null>(null);
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
    setStartTime(education ? education.startTime : new Date());
    setEndTime(education ? education.endTime || null : null);
    setDescription(education ? education.description : undefined);
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
    <Dialog open={isOpen} onClose={close} fullWidth={true}>
      <DialogTitle>{create ? "新增經驗" : "編輯經驗"}</DialogTitle>
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
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="開始時間"
              value={startTime}
              onChange={handleStartTimeChange}
              KeyboardButtonProps={{
                "aria-label": "change date"
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: 24,
                marginLeft: 16
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
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="結束時間"
                value={endTime}
                onChange={handleEndTimeChange}
                KeyboardButtonProps={{
                  "aria-label": "change date"
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
        <Button onClick={close} color="primary" variant="text">
          取消
        </Button>
        <Button
          onClick={() => {
            schoolName &&
              degree &&
              majorName &&
              startTime &&
              update({
                uuid: education?.uuid,
                schoolName,
                degree,
                majorName,
                startTime,
                endTime,
                description,
                skillTags: []
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
    </Dialog>
  );
};
const ApplicantBasicInfo: React.FC = () => {
  const classes = useStyles();
  const { getApi, reloadUser, user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false);
  const [experienceCreate, setExperienceCreate] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<Experience>();

  const [isEducationDialogOpen, setIsEducationDialogOpen] = useState(false);
  const [educationCreate, setEducationCreate] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState<Education>();

  const showDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const showExperienceDialog = () => {
    setIsExperienceDialogOpen(true);
  };

  const updateExperience = async (updatedExperience: Experience) => {
    if (user && user.profile) {
      const experienceApi = await getApi("Experience");
      if (experienceCreate)
        await experienceApi.addExperience({
          profileId: user.profile.uuid,
          experience: updatedExperience
        });
      else {
        updatedExperience.uuid &&
          (await experienceApi.updateExperience({
            experienceId: updatedExperience.uuid,
            experience: updatedExperience
          }));
      }
      await reloadUser();
    }
  };

  const deleteExperience = async (experienceId: string) => {
    if (user && user.profile) {
      const experienceApi = await getApi("Experience");
      await experienceApi.removeExperience({ experienceId });
      await reloadUser();
    }
  };

  const closeExperienceDialog = () => {
    setIsExperienceDialogOpen(false);
  };

  const showEducationDialog = () => {
    setIsEducationDialogOpen(true);
  };

  const updateEducation = async (updatedEducation: Education) => {
    if (user && user.profile) {
      const educationApi = await getApi("Education");
      if (educationCreate)
        await educationApi.addEducation({
          profileId: user.profile.uuid,
          education: updatedEducation
        });
      else {
        updatedEducation.uuid &&
          (await educationApi.updateEducation({
            educationId: updatedEducation.uuid,
            education: updatedEducation
          }));
      }
      await reloadUser();
    }
  };

  const deleteEducation = async (educationId: string) => {
    if (user && user.profile) {
      const educationApi = await getApi("Education");
      await educationApi.removeEducation({ educationId });
      await reloadUser();
    }
  };

  const closeEducationDialog = () => {
    setIsEducationDialogOpen(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className={classes.container}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <Avatar
          alt="profile image"
          src={user.profileImageUrl}
          style={{ width: 60, height: 60 }}
        />
        <div className={classes.info}>
          <div
            style={{ display: "flex", flexDirection: "row", marginBottom: 8 }}
          >
            <div className={classes.name}>{user.name}</div>
            <Button
              size="small"
              variant="outlined"
              className={classes.button}
              onClick={showDialog}
            >
              修改資料
            </Button>
          </div>
        </div>
      </div>
      <div className={classes.description}>
        {user.profile?.introduction || "尚無自我介紹"}
      </div>
      <div className={classes.items}>
        <div className={classes.title}>{"經歷"}</div>
        {(user.profile?.experiences || []).map(e => (
          <div
            key={e.uuid}
            onClick={() => {
              setSelectedExperience(e);
              setExperienceCreate(false);
              showExperienceDialog();
            }}
          >
            <ExperienceBlock {...e} />
          </div>
        ))}
        <div
          className={classes.blockAdd}
          onClick={() => {
            setSelectedExperience(undefined);
            setExperienceCreate(true);
            showExperienceDialog();
          }}
        >
          {" + 新增經驗"}
        </div>
      </div>
      <div className={classes.items}>
        <div className={classes.title}>{"學歷"}</div>
        {(user.profile?.educations || []).map(e => (
          <div
            key={e.uuid}
            onClick={() => {
              setSelectedEducation(e);
              setEducationCreate(false);
              showEducationDialog();
            }}
          >
            <EducationBlock {...e} />
          </div>
        ))}
        <div
          className={classes.blockAdd}
          onClick={() => {
            setSelectedEducation(undefined);
            setEducationCreate(true);
            showEducationDialog();
          }}
        >
          {" + 新增學歷"}
        </div>
      </div>
      <EditDialog isOpen={isDialogOpen} close={closeDialog} />
      <ExperienceDialog
        experience={selectedExperience}
        create={experienceCreate}
        isOpen={isExperienceDialogOpen}
        close={closeExperienceDialog}
        update={updateExperience}
        deleteExperience={deleteExperience}
      />
      <EducationDialog
        education={selectedEducation}
        create={educationCreate}
        isOpen={isEducationDialogOpen}
        close={closeEducationDialog}
        update={updateEducation}
        deleteEducation={deleteEducation}
      />
    </div>
  );
};

export { ApplicantBasicInfo };
