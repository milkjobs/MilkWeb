import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import MenuItem from "@material-ui/core/MenuItem";
import DialogTitle from "@material-ui/core/DialogTitle";
import { createStyles, makeStyles } from "@material-ui/styles";
import { TaiwanAreaJSON, SubArea } from "assets/TaiwanAreaJSON";
import { Theme, InputAdornment } from "@material-ui/core";
import {
  JobType,
  EducationLevel,
  ExperienceLevel,
  SalaryType,
  Job
} from "@frankyjuang/milkapi-client";
import { useAuth } from "stores";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useHistory } from "react-router";

interface JobEditFormProps {
  open: boolean;
  handleClose: () => void;
  job: Job;
}

const JobTypes = [
  {
    value: JobType.Fulltime,
    label: "正職"
  },
  {
    value: JobType.Internship,
    label: "實習"
  }
];

const EducationLevelTypes = [
  { value: EducationLevel.Any, label: "不限" },
  {
    value: EducationLevel.HighSchool,
    label: "高中／高職"
  },
  { value: EducationLevel.Bachelor, label: "大學／專科" },
  { value: EducationLevel.Master, label: "碩士" },
  { value: EducationLevel.PhD, label: "博士" }
];

const ExperienceLevelTypes = [
  { value: ExperienceLevel.Any, label: "不限" },
  {
    value: ExperienceLevel.Entry,
    label: "入門"
  },
  { value: ExperienceLevel.Mid, label: "中階" },
  { value: ExperienceLevel.Senior, label: "資深" }
];

let range = n => Array.from(Array(n).keys());

const HourlySalaryOptions = [...range(30).map(n => (n + 30) * 5)];
const MonthlySalaryOptions = [23100, ...range(120).map(n => (n + 24) * 1000)];

const JobEditForm: React.FC<JobEditFormProps> = ({
  open,
  handleClose,
  job
}) => {
  const classes = useStyles();
  const history = useHistory();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { getApi, user, reloadUser } = useAuth();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [area, setArea] = useState<string>(job.address.area);
  const [areaErrorMessage, setAreaErrorMessage] = useState<string>();
  const [subArea, setSubArea] = useState<string | undefined>(
    job.address.subArea
  );
  const [subAreaErrorMessage, setSubAreaErrorMessage] = useState<string>();
  const [subAreaOptions, setSubAreaOptions] = useState<SubArea[]>([]);
  const [street, setStreet] = useState(job.address.street);
  const [streetErrorMessage, setStreetErrorMessage] = useState<string>();
  const [salaryType, setSalaryType] = useState<SalaryType>(job.salaryType);
  const [minSalary, setMinSalary] = useState<number>(job.minSalary);
  const [minSalaryErrorMessage, setMinSalaryErrorMessage] = useState<string>();
  const [maxSalary, setMaxSalary] = useState<number | undefined>(job.maxSalary);
  const [maxSalaryErrorMessage, setMaxSalaryErrorMessage] = useState<string>();
  const [educationNeed, setEducationNeed] = useState<EducationLevel>(
    job.educationNeed
  );
  const [educationNeedErrorMessage, setEducationNeedErrorMessage] = useState<
    string
  >();
  const [experienceNeed, setExperienceNeed] = useState<ExperienceLevel>(
    job.experienceNeed
  );
  const [experienceNeedErrorMessage, setExperienceNeedErrorMessage] = useState<
    string
  >();
  const [description, setDescription] = useState<string | undefined>(
    job.description
  );

  const publish = async () => {
    const jobApi = await getApi("Job");
    if (!area) {
      setAreaErrorMessage("請選擇縣市");
      return;
    }
    if (!subArea) {
      setSubAreaErrorMessage("請選擇地區");
      return;
    }
    if (!street) {
      setStreetErrorMessage("請輸入地址");
      return;
    }
    if (!minSalary) {
      setMinSalaryErrorMessage("請選擇");
      return;
    }
    if (!maxSalary) {
      setMaxSalaryErrorMessage("請選擇");
      return;
    }
    if (!educationNeed) {
      setEducationNeedErrorMessage("請選擇學歷要求");
      return;
    }
    if (!experienceNeed) {
      setExperienceNeedErrorMessage("請選擇經驗要求");
      return;
    }
    if (user && user.recruiterInfo && user.recruiterInfo.uuid && salaryType) {
      setLoading(true);
      await jobApi.updateJob({
        jobId: job.uuid,
        job: {
          ...job,
          minSalary,
          maxSalary,
          salaryType,
          address: { area, subArea, street },
          educationNeed,
          experienceNeed,
          description
        }
      });
      await reloadUser();
      setLoading(false);
    }
    handleClose();
  };

  const handleAreaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setArea(event.target.value);
    setAreaErrorMessage("");
  };

  const handleSubAreaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubArea(event.target.value);
    setSubAreaErrorMessage("");
    const selectedMainArea = TaiwanAreaJSON.find(a => a.name === area);
    setSubAreaOptions(selectedMainArea ? selectedMainArea.districts : []);
    setSubArea(undefined);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStreet(event.target.value);
    setStreetErrorMessage("");
  };

  const handleMinSalaryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMinSalary(parseInt(event.target.value));
    setMinSalaryErrorMessage("");
  };

  const handleMaxSalaryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMaxSalary(parseInt(event.target.value));
    setMaxSalaryErrorMessage("");
  };

  const handleEducationLevelChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (
      event.target.value === EducationLevel.Any ||
      event.target.value === EducationLevel.Bachelor ||
      event.target.value === EducationLevel.HighSchool ||
      event.target.value === EducationLevel.Master ||
      event.target.value === EducationLevel.PhD
    ) {
      setEducationNeed(event.target.value);
      setEducationNeedErrorMessage("");
    }
  };

  const handleExperienceLevelChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (
      event.target.value === ExperienceLevel.Any ||
      event.target.value === ExperienceLevel.Entry ||
      event.target.value === ExperienceLevel.Mid ||
      event.target.value === ExperienceLevel.Senior
    ) {
      setExperienceNeed(event.target.value);
      setExperienceNeedErrorMessage("");
    }
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  useEffect(() => {
    if (minSalary && maxSalary && minSalary > maxSalary)
      setMaxSalary(undefined);
  }, [minSalary]);

  useEffect(() => {
    const selectedMainArea = TaiwanAreaJSON.find(a => a.name === area);
    setSubAreaOptions(selectedMainArea ? selectedMainArea.districts : []);
  }, [area]);

  const removeJob = async () => {
    setDeleteLoading(true);
    const jobApi = await getApi("Job");
    await jobApi.removeJob({ jobId: job.uuid });
    await reloadUser();
    setDeleteLoading(false);
    handleDeleteDialogClose();
    history.push("/recruiter");
  };

  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
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
        <DialogTitle id="form-dialog-title">編輯職缺</DialogTitle>
        <DialogContent>
          <div style={{ display: "flex" }}>
            <TextField
              style={{ marginRight: 4 }}
              error={Boolean(areaErrorMessage)}
              helperText={areaErrorMessage}
              id="standard-select-currency"
              select
              fullWidth
              label="縣市"
              value={area}
              onChange={handleAreaChange}
              SelectProps={{
                MenuProps: {
                  className: classes.menu
                }
              }}
              margin="normal"
            >
              {TaiwanAreaJSON.map(option => (
                <MenuItem key={option.name} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              style={{ marginLeft: 4 }}
              error={Boolean(subAreaErrorMessage)}
              helperText={subAreaErrorMessage}
              id="standard-select-currency"
              select
              fullWidth
              label="地區"
              value={subArea}
              onChange={handleSubAreaChange}
              SelectProps={{
                MenuProps: {
                  className: classes.menu
                }
              }}
              margin="normal"
            >
              {subAreaOptions.map(option => (
                <MenuItem key={option.name} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <TextField
            error={Boolean(streetErrorMessage)}
            helperText={streetErrorMessage}
            InputProps={{
              startAdornment: (
                <InputAdornment
                  style={{
                    width: "25%",
                    display: "flex",
                    justifyContent: "center"
                  }}
                  position="start"
                >
                  {(area || "") + (subArea || "")}
                </InputAdornment>
              )
            }}
            margin="normal"
            id="name"
            label="地址"
            value={street}
            fullWidth
            onChange={handleAddressChange}
          />
          {salaryType && (
            <div style={{ display: "flex" }}>
              <TextField
                style={{ marginRight: 4 }}
                error={Boolean(minSalaryErrorMessage)}
                helperText={minSalaryErrorMessage}
                id="standard-select-currency"
                select
                fullWidth
                label={`${
                  salaryType === SalaryType.Monthly ? "月薪" : "時薪"
                }下限`}
                value={minSalary}
                onChange={handleMinSalaryChange}
                SelectProps={{
                  MenuProps: {
                    className: classes.menu
                  }
                }}
                margin="normal"
              >
                {(salaryType === SalaryType.Monthly
                  ? MonthlySalaryOptions
                  : HourlySalaryOptions
                ).map(option => (
                  <MenuItem key={option} value={option}>
                    {salaryType === SalaryType.Monthly
                      ? option / 1000 + "K"
                      : option}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                style={{ marginLeft: 4 }}
                error={Boolean(maxSalaryErrorMessage)}
                helperText={maxSalaryErrorMessage}
                id="standard-select-currency"
                select
                fullWidth
                label={`${
                  salaryType === SalaryType.Monthly ? "月薪" : "時薪"
                }上限`}
                value={maxSalary}
                onChange={handleMaxSalaryChange}
                SelectProps={{
                  MenuProps: {
                    className: classes.menu
                  }
                }}
                margin="normal"
              >
                {(salaryType === SalaryType.Monthly
                  ? MonthlySalaryOptions
                  : HourlySalaryOptions
                )
                  .filter(option => option > (minSalary || 0))
                  .map(option => (
                    <MenuItem key={option} value={option}>
                      {salaryType === SalaryType.Monthly
                        ? option / 1000 + "K"
                        : option}
                    </MenuItem>
                  ))}
              </TextField>
            </div>
          )}
          <TextField
            id="standard-select-currency"
            error={Boolean(educationNeedErrorMessage)}
            helperText={educationNeedErrorMessage}
            select
            fullWidth
            label="學歷要求"
            value={educationNeed}
            onChange={handleEducationLevelChange}
            SelectProps={{
              MenuProps: {
                className: classes.menu
              }
            }}
            margin="normal"
          >
            {EducationLevelTypes.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="standard-select-currency"
            error={Boolean(experienceNeedErrorMessage)}
            helperText={experienceNeedErrorMessage}
            select
            fullWidth
            label="經驗要求"
            value={experienceNeed}
            onChange={handleExperienceLevelChange}
            SelectProps={{
              MenuProps: {
                className: classes.menu
              }
            }}
            margin="normal"
          >
            {ExperienceLevelTypes.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="normal"
            id="name"
            label="介紹（選填）"
            value={description}
            onChange={handleDescriptionChange}
            multiline
            rows="10"
            rowsMax="10"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteDialogOpen}
            color="secondary"
            style={{ marginRight: "auto" }}
          >
            刪除
          </Button>
          <Button onClick={handleClose} color="primary">
            取消
          </Button>
          {loading ? (
            <CircularProgress
              style={{ width: 20, height: 20, marginLeft: 20, marginRight: 20 }}
            />
          ) : (
            <Button onClick={publish} color="primary">
              儲存
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent style={{ marginTop: 16, marginBottom: 16 }}>
          你確定要刪除這個職缺嗎？
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            取消
          </Button>
          {deleteLoading ? (
            <CircularProgress
              style={{ width: 20, height: 20, marginLeft: 20, marginRight: 20 }}
            />
          ) : (
            <Button
              style={{
                boxShadow: "none",
                color: "white"
              }}
              onClick={removeJob}
              variant="contained"
              color="secondary"
              autoFocus
            >
              確定
            </Button>
          )}
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

export { JobEditForm };
