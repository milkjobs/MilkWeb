import {
  EducationLevel,
  ExperienceLevel,
  JobType,
  JobUnpublishedReason,
  SalaryType,
  Tag,
  TagType,
} from "@frankyjuang/milkapi-client";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  TextField,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { SubArea, TaiwanAreaJSON } from "assets/TaiwanAreaJSON";
import to from "await-to-js";
import { AlertDialog } from "components/Util";
import Fuse from "fuse.js";
import {
  AlertType,
  EducationLevelOptions,
  ExperienceLevelOptions,
  JobTypeOptions,
  normalizeSchoolName,
} from "helpers";
import React, { useEffect, useState } from "react";
import { useAuth } from "stores";
import { HourlySalaryOptions, MonthlySalaryOptions } from "./utils";
import { JobCatalogues } from "assets/jobs";

interface FuzzyTag {
  normalizedLabel: string;
  tag: Tag;
}

interface Props {
  open: boolean;
  handleClose: () => void;
}

const JobCreateForm: React.FC<Props> = ({ open, handleClose }) => {
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
  const [contact, setContact] = useState<string>();
  const [contactErrorMessage, setContactErrorMessage] = useState<string>();
  const [salaryType, setSalaryType] = useState<SalaryType>();
  const [minSalary, setMinSalary] = useState(0);
  const [maxSalary, setMaxSalary] = useState(0);
  const [educationNeed, setEducationNeed] = useState<EducationLevel>();
  const [educationNeedErrorMessage, setEducationNeedErrorMessage] = useState<
    string
  >();
  const [experienceNeed, setExperienceNeed] = useState<ExperienceLevel>();
  const [experienceNeedErrorMessage, setExperienceNeedErrorMessage] = useState<
    string
  >();
  const [description, setDescription] = useState<string>();
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState<
    string
  >();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>();
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagOptions, setTagOptions] = useState<Tag[]>([]);
  const [fuse, setFuse] = useState<
    Fuse<FuzzyTag, Fuse.FuseOptions<FuzzyTag>>
  >();
  const [titleOptions, setTitleOptions] = useState<string[]>([]);
  const [title, setTitle] = useState<string>();
  const [titleFuse, setTitleFuse] = useState<
    Fuse<string, Fuse.FuseOptions<string>>
  >();
  const [titleErrorMessage, setTitleErrorMessage] = useState<string>();

  const showAlert = () => setAlertOpen(true);
  const hideAlert = () => setAlertOpen(false);

  useEffect(() => {
    const getTitleOptions = async () => {
      const allTitles = JobCatalogues.reduce<string[]>((result, catalogue) => {
        const subTitles = catalogue.subCatalogues.reduce<string[]>(
          (subResult, subCatalogue) => {
            subResult.push(...subCatalogue.jobs);
            return subResult;
          },
          []
        );
        result.push(...subTitles);
        return result;
      }, []);
      const titles = [...new Set(allTitles)];

      const options: Fuse.FuseOptions<string> = {
        shouldSort: true,
        tokenize: true,
        matchAllTokens: true,
      };
      setTitleFuse(new Fuse(titles, options));
      setTitleOptions(titles);
    };

    getTitleOptions();
  }, []);

  useEffect(() => {
    const getTags = async () => {
      const tagApi = await getApi("Tag");
      const [[, schoolTags], [, departmentTags]] = await Promise.all([
        to(tagApi.getTags({ type: TagType.School })),
        to(tagApi.getTags({ type: TagType.Department })),
      ]);

      const schoolEntries = (schoolTags || []).map<FuzzyTag>((t) => ({
        normalizedLabel: normalizeSchoolName(t.label),
        tag: t,
      }));
      const departmentEntries = (departmentTags || []).map<FuzzyTag>((t) => ({
        normalizedLabel: t.label,
        tag: t,
      }));
      const options: Fuse.FuseOptions<FuzzyTag> = {
        shouldSort: true,
        tokenize: true,
        matchAllTokens: true,
        keys: ["normalizedLabel"],
      };
      setFuse(new Fuse([...schoolEntries, ...departmentEntries], options));
      setTagOptions([...(schoolTags || []), ...(departmentTags || [])]);
    };

    getTags();
  }, [getApi]);

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
    if (!title) {
      setTitleErrorMessage("請選擇職位分類");
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
          title,
          minSalary,
          maxSalary,
          salaryType,
          address: { area, subArea, street },
          contact,
          educationNeed,
          experienceNeed,
          description,
          tags,
        },
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
      event.target.value === JobType.Internship ||
      event.target.value === JobType.Parttime
    ) {
      setType(event.target.value);
      setTypeErrorMessage("");
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 50) {
      setNameErrorMessage("職缺名稱最長不能超過 50 個字");
      return;
    }
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
    if (event.target.value.length > 100) {
      setStreetErrorMessage("地址最長不能超過 100 個字");
      return;
    }
    setStreet(event.target.value);
    setStreetErrorMessage("");
  };

  const handleContactChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 512) {
      setContactErrorMessage("聯絡方式最長不能超過 512 個字");
      return;
    }
    setContact(event.target.value);
    setContactErrorMessage(undefined);
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
    if (event.target.value.length > 2000) {
      setDescriptionErrorMessage("介紹最長不能超過 2000 個字");
      return;
    }
    setDescription(event.target.value);
    setDescriptionErrorMessage("");
  };

  useEffect(() => {
    if (type === JobType.Fulltime) {
      setSalaryType(SalaryType.Monthly);
      setMinSalary(40000);
      setMaxSalary(60000);
    } else if (type === JobType.Internship || type === JobType.Parttime) {
      setSalaryType(SalaryType.Hourly);
      setMinSalary(180);
      setMaxSalary(200);
    } else {
      setSalaryType(undefined);
    }
  }, [type]);

  useEffect(() => {
    const selectedMainArea = TaiwanAreaJSON.find((a) => a.name === area);
    setSubAreaOptions(selectedMainArea ? selectedMainArea.districts : []);
    setSubArea(undefined);
  }, [area]);

  return (
    <div>
      {alertType !== undefined && (
        <AlertDialog isOpen={alertOpen} close={hideAlert} type={alertType} />
      )}
      <Dialog maxWidth="sm" fullWidth open={open} onClose={handleClose}>
        <DialogTitle id="create-job">刊登職缺</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            error={Boolean(typeErrorMessage)}
            fullWidth
            helperText={typeErrorMessage}
            id="job-type"
            label="類型"
            margin="normal"
            onChange={handleTypeChange}
            select
            value={type || ""}
          >
            {JobTypeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            error={Boolean(nameErrorMessage)}
            fullWidth
            helperText={nameErrorMessage}
            id="name"
            label="名稱"
            margin="normal"
            onChange={handleNameChange}
            value={name || ""}
          />
          <Autocomplete
            clearText="清除職位"
            closeText="收起清單"
            defaultValue={""}
            getOptionLabel={(option) => option}
            id="titles"
            multiple={false}
            noOptionsText="找不到分類"
            openText="展開清單"
            options={titleOptions}
            value={title}
            onChange={(_event, newValue) => {
              if (newValue) {
                setTitle(newValue);
                setTitleErrorMessage("");
              }
            }}
            filterOptions={(_options, { inputValue }) =>
              inputValue && titleFuse
                ? titleFuse
                    .search<string, false, false>(inputValue)
                    .map((i) => titleOptions[i])
                : titleOptions
            }
            renderInput={(params) => (
              <TextField {...params} margin="normal" label="職位分類" />
            )}
          />
          {Boolean(titleErrorMessage) && (
            <div style={{ color: "#fa6c71" }}>{titleErrorMessage}</div>
          )}
          <div style={{ display: "flex" }}>
            <TextField
              error={Boolean(areaErrorMessage)}
              fullWidth
              helperText={areaErrorMessage}
              id="area"
              label="縣市"
              margin="normal"
              onChange={handleAreaChange}
              select
              style={{ marginRight: 4 }}
              value={area || ""}
            >
              {TaiwanAreaJSON.map((option) => (
                <MenuItem key={option.name} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              disabled={subAreaOptions.length === 0}
              error={Boolean(subAreaErrorMessage)}
              fullWidth
              helperText={subAreaErrorMessage}
              id="sub-area"
              label="地區"
              margin="normal"
              onChange={handleSubAreaChange}
              select
              style={{ marginLeft: 4 }}
              value={subArea || ""}
            >
              {subAreaOptions.map((option) => (
                <MenuItem key={option.name} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <TextField
            error={Boolean(streetErrorMessage)}
            fullWidth
            helperText={streetErrorMessage}
            id="street"
            label="地址"
            margin="normal"
            onChange={handleAddressChange}
            value={street || ""}
            InputProps={{
              startAdornment: (
                <InputAdornment
                  style={{
                    width: "25%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                  position="start"
                >
                  {(area || "縣市") + (subArea || "地區")}
                </InputAdornment>
              ),
            }}
          />
          <TextField
            error={Boolean(contactErrorMessage)}
            fullWidth
            helperText={contactErrorMessage}
            id="contact"
            label="聯絡方式（選填）"
            margin="normal"
            onChange={handleContactChange}
            value={contact}
          />
          <div style={{ display: "flex" }}>
            <TextField
              disabled={!salaryType}
              fullWidth
              id="min-salary"
              label={
                salaryType === SalaryType.Monthly
                  ? "最低月薪"
                  : salaryType === SalaryType.Hourly
                  ? "最低時薪"
                  : "最低薪資"
              }
              margin="normal"
              style={{ marginRight: 4 }}
              value={minSalary}
              onChange={(e) => {
                if (/^\d+$/.test(e.target.value)) {
                  setMinSalary(parseInt(e.target.value));
                }
              }}
              onBlur={() => {
                const options =
                  salaryType === SalaryType.Monthly
                    ? MonthlySalaryOptions
                    : HourlySalaryOptions;
                let salary = minSalary;
                // Round to hundreds.
                if (salaryType === SalaryType.Monthly) {
                  salary = Math.round(salary / 100) * 100;
                }
                if (salary < options[0]) {
                  salary = options[0];
                } else if (salary > options[options.length - 1]) {
                  salary = options[options.length - 1];
                }

                setMinSalary(salary);
                if (salary > maxSalary) {
                  setMaxSalary(salary);
                }
              }}
            />
            <TextField
              disabled={!salaryType}
              fullWidth
              id="max-salary"
              label={
                salaryType === SalaryType.Monthly
                  ? "最高月薪"
                  : salaryType === SalaryType.Hourly
                  ? "最高時薪"
                  : "最高薪資"
              }
              margin="normal"
              style={{ marginLeft: 4 }}
              value={maxSalary}
              onChange={(e) => {
                if (/^\d+$/.test(e.target.value)) {
                  setMaxSalary(parseInt(e.target.value));
                }
              }}
              onBlur={() => {
                const options =
                  salaryType === SalaryType.Monthly
                    ? MonthlySalaryOptions
                    : HourlySalaryOptions;
                let salary = maxSalary;
                // Round to hundreds.
                if (salaryType === SalaryType.Monthly) {
                  salary = Math.round(salary / 100) * 100;
                }
                if (salary < options[0]) {
                  salary = options[0];
                } else if (salary > options[options.length - 1]) {
                  salary = options[options.length - 1];
                }

                setMaxSalary(salary);
                if (salary < minSalary) {
                  setMinSalary(salary);
                }
              }}
            />
          </div>
          {/* <Slider
            disabled={!salaryType}
            step={null}
            value={[minSalary, maxSalary]}
            valueLabelDisplay="off"
            min={
              salaryType === SalaryType.Monthly
                ? MonthlySalaryOptions[0]
                : HourlySalaryOptions[0]
            }
            max={
              salaryType === SalaryType.Monthly
                ? MonthlySalaryOptions[MonthlySalaryOptions.length - 1]
                : HourlySalaryOptions[HourlySalaryOptions.length - 1]
            }
            marks={
              salaryType === SalaryType.Monthly
                ? MonthlySalaryOptions.map(value => ({ value }))
                : HourlySalaryOptions.map(value => ({ value }))
            }
            onChange={(_e, newValue) => {
              setMinSalary(newValue[0]);
              setMaxSalary(newValue[1]);
            }}
          /> */}
          <div style={{ display: "flex" }}>
            <TextField
              error={Boolean(educationNeedErrorMessage)}
              fullWidth
              helperText={educationNeedErrorMessage}
              id="education-need"
              label="學歷要求"
              margin="normal"
              onChange={handleEducationLevelChange}
              select
              style={{ marginRight: 4 }}
              value={educationNeed || ""}
            >
              {EducationLevelOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              error={Boolean(experienceNeedErrorMessage)}
              fullWidth
              helperText={experienceNeedErrorMessage}
              id="experience-need"
              label="經驗要求"
              margin="normal"
              onChange={handleExperienceLevelChange}
              select
              style={{ marginLeft: 4 }}
              value={experienceNeed || ""}
            >
              {ExperienceLevelOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <Autocomplete
            clearText="清除已選的校系"
            closeText="收起清單"
            defaultValue={[]}
            getOptionLabel={(option) => option.label}
            id="tags"
            multiple
            noOptionsText="找不到學校、系所"
            openText="展開清單"
            options={tagOptions}
            value={tags}
            onChange={(_event, newValue) => {
              setTags(newValue);
            }}
            filterOptions={(_options, { inputValue }) =>
              inputValue && fuse
                ? fuse
                    .search<FuzzyTag, false, false>(inputValue)
                    .map((ft) => ft.tag)
                : tagOptions
            }
            renderInput={(params) => (
              <TextField
                {...params}
                margin="normal"
                label="相關的學校、系所（選填）"
                helperText="幫助相關校系的學生看到此職缺，可以是可能的招募對象、公司同事的背景等"
              />
            )}
          />
          <TextField
            error={Boolean(descriptionErrorMessage)}
            fullWidth
            helperText={descriptionErrorMessage}
            id="description"
            label="介紹（選填）"
            margin="normal"
            multiline
            onChange={handleDescriptionChange}
            rows="10"
            rowsMax="10"
            value={description || ""}
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
            <Button onClick={publish} color="primary" variant="contained">
              刊登
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export { JobCreateForm };
