import {
  EducationLevel,
  ExperienceLevel,
  JobType,
  JobUnpublishedReason,
  SalaryType
} from "@frankyjuang/milkapi-client";
import { InputAdornment, Theme } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { createStyles, makeStyles } from "@material-ui/styles";
import { SubArea, TaiwanAreaJSON } from "assets/TaiwanAreaJSON";
import { AlertDialog } from "components/Util";
import { AlertType } from "helpers";
import React, { useEffect, useState } from "react";
import { useAuth } from "stores";

interface JobCreateFormProps {
  open: boolean;
  handleClose: () => void;
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

const range = n => Array.from(Array(n).keys());

const HourlySalaryOptions = [...range(30).map(n => (n + 30) * 5)];
const MonthlySalaryOptions = [23100, ...range(120).map(n => (n + 24) * 1000)];

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

const JobCreateForm: React.FC<JobCreateFormProps> = ({ open, handleClose }) => {
  const classes = useStyles();
  const { getApi, user, reloadUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<JobType>();
  const [typeErrorMessage, setTypeErrorMessage] = useState<string>();
  const [name, setName] = useState<string>();
  const [nameErrorMessage, setNameErrorMessage] = useState<string>();
  const [area, setArea] = useState<string>();
  const [areaErrorMessage, setAreaErrorMessage] = useState<string>();
  const [subArea, setSubArea] = useState<string>();
  const [subAreaErrorMessage, setSubAreaErrorMessage] = useState<string>();
  const [subAreaOptions, setSubAreaOptions] = useState<SubArea[]>([]);
  const [street, setStreet] = useState("");
  const [streetErrorMessage, setStreetErrorMessage] = useState<string>();
  const [salaryType, setSalaryType] = useState<SalaryType>();
  const [minSalary, setMinSalary] = useState<number>();
  const [minSalaryErrorMessage, setMinSalaryErrorMessage] = useState<string>();
  const [maxSalary, setMaxSalary] = useState<number>();
  const [maxSalaryErrorMessage, setMaxSalaryErrorMessage] = useState<string>();
  const [educationNeed, setEducationNeed] = useState<EducationLevel>();
  const [educationNeedErrorMessage, setEducationNeedErrorMessage] = useState<
    string
  >();
  const [experienceNeed, setExperienceNeed] = useState<ExperienceLevel>();
  const [experienceNeedErrorMessage, setExperienceNeedErrorMessage] = useState<
    string
  >();
  const [description, setDescription] = useState<string>();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>();

  const showAlert = () => setAlertOpen(true);
  const hideAlert = () => setAlertOpen(false);

  const publish = async () => {
    const jobApi = await getApi("Job");
    if (!type) {
      setTypeErrorMessage("請選擇類型");
      return;
    }
    if (!name) {
      setNameErrorMessage("請輸入名稱");
      return;
    }
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
      const newJob = await jobApi.addJob({
        recruiterInfoId: user.recruiterInfo.uuid,
        newJob: {
          type,
          name,
          skillTags: [],
          minSalary,
          maxSalary,
          salaryType,
          address: { area, subArea, street },
          educationNeed,
          experienceNeed,
          description
        }
      });
      if (
        !newJob.published &&
        newJob.unpublishedReason === JobUnpublishedReason.NotVerified
      ) {
        setAlertType(AlertType.NotVerification);
        showAlert();
      }
      await reloadUser();
      setLoading(false);
    }
    handleClose();
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      event.target.value === JobType.Fulltime ||
      event.target.value === JobType.Internship
    ) {
      setType(event.target.value);
      setTypeErrorMessage("");
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setNameErrorMessage("");
  };

  const handleAreaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setArea(event.target.value);
    setAreaErrorMessage("");
  };

  const handleSubAreaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubArea(event.target.value);
    setSubAreaErrorMessage("");
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
    if (type === JobType.Fulltime) setSalaryType(SalaryType.Monthly);
    if (type === JobType.Internship) setSalaryType(SalaryType.Hourly);
    setMinSalary(undefined);
    setMaxSalary(undefined);
  }, [type]);

  useEffect(() => {
    if (minSalary && maxSalary && minSalary > maxSalary)
      setMaxSalary(undefined);
  }, [minSalary, maxSalary]);

  useEffect(() => {
    const selectedMainArea = TaiwanAreaJSON.find(a => a.name === area);
    setSubAreaOptions(selectedMainArea ? selectedMainArea.districts : []);
    setSubArea(undefined);
  }, [area]);

  return (
    <div>
      {alertType !== undefined && (
        <AlertDialog isOpen={alertOpen} close={hideAlert} type={alertType} />
      )}
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
            error={Boolean(typeErrorMessage)}
            id="standard-select-currency"
            autoFocus
            select
            fullWidth
            helperText={typeErrorMessage}
            label="類型"
            value={type}
            onChange={handleTypeChange}
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
            error={Boolean(nameErrorMessage)}
            helperText={nameErrorMessage}
            margin="normal"
            id="name"
            label="名稱"
            value={name}
            fullWidth
            onChange={handleNameChange}
          />
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
          <Button onClick={handleClose} color="primary">
            取消
          </Button>
          {loading ? (
            <CircularProgress
              style={{ width: 20, height: 20, marginLeft: 20, marginRight: 20 }}
            />
          ) : (
            <Button onClick={publish} color="primary">
              發布
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export { JobCreateForm };
