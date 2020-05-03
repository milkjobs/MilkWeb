import {
  JobGoal,
  JobGoalSalaryTypeEnum,
  JobGoalTypeEnum,
} from "@frankyjuang/milkapi-client";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { Autocomplete } from "@material-ui/lab";
import { JobCatalogues } from "assets/jobs";
import { TaiwanAreaJSON } from "assets/TaiwanAreaJSON";
import to from "await-to-js";
import {
  HourlySalaryOptions,
  MonthlySalaryOptions,
} from "components/Job/utils";
import Fuse from "fuse.js";
import { JobTypeOptions, SalaryTypeOptions } from "helpers";
import React, { useEffect, useState } from "react";
import { useAuth } from "stores";

interface JobGoalDialogContentProps {
  jobGoal?: JobGoal;
  disableCancel?: boolean;
  close: () => void;
  update: (jobGoal: JobGoal) => void;
}

const JobGoalDialogContent: React.FC<JobGoalDialogContentProps> = (props) => {
  const { close, update, jobGoal, disableCancel } = props;
  const { getApi } = useAuth();
  const [type, setType] = useState<JobGoalTypeEnum>();
  const [salaryType, setSalaryType] = useState<JobGoalSalaryTypeEnum>();
  const [minSalary, setMinSalary] = useState<number | null>();
  const [maxSalary, setMaxSalary] = useState<number | null>();
  const [areas, setAreas] = useState<string[]>([]);
  const [titleOptions, setTitleOptions] = useState<string[]>([]);
  const [titles, setTitles] = useState<string[]>([]);
  const [titleFuse, setTitleFuse] = useState<
    Fuse<string, Fuse.FuseOptions<string>>
  >();
  const [fieldOptions, setFieldOptions] = useState<string[]>([]);
  const [fields, setFields] = useState<string[]>([]);
  const [fieldFuse, setFieldFuse] = useState<
    Fuse<string, Fuse.FuseOptions<string>>
  >();
  const [titlesErrorMessage, setTitlesErrorMessage] = useState<string>();
  const [areasErrorMessage, setAreasErrorMessage] = useState<string>();

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      event.target.value === JobGoalTypeEnum.Fulltime ||
      event.target.value === JobGoalTypeEnum.Internship ||
      event.target.value === JobGoalTypeEnum.Parttime
    ) {
      setType(event.target.value);
    } else {
      setType(undefined);
    }
  };

  const handleSalaryTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (
      event.target.value === JobGoalSalaryTypeEnum.Hourly ||
      event.target.value === JobGoalSalaryTypeEnum.Monthly
    ) {
      setSalaryType(event.target.value);
    } else {
      setSalaryType(undefined);
    }
  };

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
    const getFieldOptions = async () => {
      const teamApi = await getApi("Team");
      const [, fields] = await to(teamApi.getFields());
      if (!fields) {
        return;
      }

      const options: Fuse.FuseOptions<string> = {
        shouldSort: true,
        tokenize: true,
        matchAllTokens: true,
      };
      setFieldFuse(new Fuse(fields, options));
      setFieldOptions(fields);
    };

    getFieldOptions();
  }, [getApi]);

  useEffect(() => {
    if (!salaryType) {
      setMinSalary(undefined);
      setMaxSalary(undefined);
      return;
    }

    if (jobGoal && salaryType === jobGoal.salaryType) {
      setSalaryType(jobGoal.salaryType);
      setMinSalary(jobGoal.minSalary);
      setMaxSalary(jobGoal.maxSalary);
    } else if (salaryType === JobGoalSalaryTypeEnum.Monthly) {
      setMinSalary(40000);
      setMaxSalary(60000);
    } else if (salaryType === JobGoalSalaryTypeEnum.Hourly) {
      setMinSalary(180);
      setMaxSalary(200);
    }
  }, [jobGoal, salaryType]);

  useEffect(() => {
    setType(jobGoal?.type);
    setTitles(jobGoal?.titles || []);
    if (jobGoal?.salaryType && jobGoal.maxSalary && jobGoal.minSalary) {
      setSalaryType(jobGoal.salaryType);
      setMinSalary(jobGoal.minSalary);
      setMaxSalary(jobGoal.maxSalary);
    } else {
      setSalaryType(undefined);
      setMinSalary(undefined);
      setMaxSalary(undefined);
    }
    setAreas(jobGoal?.areas || []);
    setFields(jobGoal?.fields || []);
  }, [jobGoal]);

  return (
    <>
      <DialogContent>
        <Autocomplete
          clearText="清除縣市"
          closeText="收起清單"
          defaultValue={[]}
          getOptionLabel={(option) => option}
          id="areas"
          multiple
          noOptionsText="找不到縣市"
          openText="展開清單"
          options={TaiwanAreaJSON.map((a) => a.name)}
          value={areas}
          onChange={(_event, newValue) => {
            setAreas(newValue);
          }}
          filterOptions={(_options, { inputValue }) =>
            TaiwanAreaJSON.map((a) => a.name).filter((a) =>
              a.includes(inputValue)
            )
          }
          renderInput={(params) => (
            <TextField {...params} margin="normal" label="縣市" />
          )}
        />
        {Boolean(areasErrorMessage) && (
          <div style={{ color: "#fa6c71" }}>{areasErrorMessage}</div>
        )}
        <Autocomplete
          clearText="清除職位"
          closeText="收起清單"
          defaultValue={[]}
          getOptionLabel={(option) => option}
          id="titles"
          multiple
          noOptionsText="找不到職位"
          openText="展開清單"
          options={titleOptions}
          value={titles}
          onChange={(_event, newValue) => {
            setTitles(newValue);
          }}
          filterOptions={(_options, { inputValue }) =>
            inputValue && titleFuse
              ? titleFuse
                  .search<string, false, false>(inputValue)
                  .map((i) => titleOptions[i])
              : titleOptions
          }
          renderInput={(params) => (
            <TextField {...params} margin="normal" label="職位" />
          )}
        />
        {Boolean(titlesErrorMessage) && (
          <div style={{ color: "#fa6c71" }}>{titlesErrorMessage}</div>
        )}
        <Autocomplete
          clearText="清除產業領域"
          closeText="收起清單"
          defaultValue={[]}
          getOptionLabel={(option) => option}
          id="fields"
          multiple
          noOptionsText="找不到產業領域"
          openText="展開清單"
          options={fieldOptions}
          value={fields}
          onChange={(_event, newValue) => {
            setFields(newValue);
          }}
          filterOptions={(_options, { inputValue }) =>
            inputValue && fieldFuse
              ? fieldFuse
                  .search<string, false, false>(inputValue)
                  .map((i) => fieldOptions[i])
              : fieldOptions
          }
          renderInput={(params) => (
            <TextField {...params} margin="normal" label="產業領域" />
          )}
        />
        <TextField
          fullWidth
          id="job-type"
          label="類型"
          margin="normal"
          onChange={handleTypeChange}
          select
          value={type || "any"}
        >
          <MenuItem value="any">不限</MenuItem>
          {JobTypeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <div style={{ display: "flex" }}>
          <TextField
            fullWidth
            id="salary-type"
            label="薪水"
            margin="normal"
            onChange={handleSalaryTypeChange}
            select
            value={salaryType || "any"}
          >
            <MenuItem value="any">面議</MenuItem>
            {SalaryTypeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            disabled={!salaryType}
            fullWidth
            id="min-salary"
            label={
              salaryType === JobGoalSalaryTypeEnum.Monthly
                ? "最低月薪"
                : salaryType === JobGoalSalaryTypeEnum.Hourly
                ? "最低時薪"
                : "最低薪資"
            }
            margin="normal"
            style={{ marginLeft: 4, marginRight: 4 }}
            value={minSalary || 0}
            onChange={(e) => {
              if (/^\d+$/.test(e.target.value)) {
                setMinSalary(parseInt(e.target.value));
              }
            }}
            onBlur={() => {
              if (!minSalary || !maxSalary || !salaryType) {
                return;
              }

              const options =
                salaryType === JobGoalSalaryTypeEnum.Monthly
                  ? MonthlySalaryOptions
                  : HourlySalaryOptions;
              let salary = minSalary;
              // Round to hundreds.
              if (salaryType === JobGoalSalaryTypeEnum.Monthly) {
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
              salaryType === JobGoalSalaryTypeEnum.Monthly
                ? "最高月薪"
                : salaryType === JobGoalSalaryTypeEnum.Hourly
                ? "最高時薪"
                : "最高薪資"
            }
            margin="normal"
            style={{ marginLeft: 4 }}
            value={maxSalary || 0}
            onChange={(e) => {
              if (/^\d+$/.test(e.target.value)) {
                setMaxSalary(parseInt(e.target.value));
              }
            }}
            onBlur={() => {
              if (!minSalary || !maxSalary || !salaryType) {
                return;
              }

              const options =
                salaryType === JobGoalSalaryTypeEnum.Monthly
                  ? MonthlySalaryOptions
                  : HourlySalaryOptions;
              let salary = maxSalary;
              // Round to hundreds.
              if (salaryType === JobGoalSalaryTypeEnum.Monthly) {
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
      </DialogContent>
      <DialogActions>
        {!disableCancel && (
          <Button onClick={close} color="primary" variant="text">
            取消
          </Button>
        )}
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            if (areas === undefined || areas.length === 0)
              setAreasErrorMessage("縣市不能為空");
            else if (titles?.length === 0)
              setTitlesErrorMessage("職位不能為空");
            else {
              update({
                ...jobGoal,
                type,
                salaryType,
                minSalary,
                maxSalary,
                fields,
                titles,
                areas,
              });
              close();
            }
          }}
        >
          儲存
        </Button>
      </DialogActions>
    </>
  );
};

export { JobGoalDialogContent };
