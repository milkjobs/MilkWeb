import { JobGoal } from "@frankyjuang/milkapi-client";
import { makeStyles } from "@material-ui/core/styles";
import {
  jobGoalSalaryTypeToSalaryType,
  jobGoalTypeToJobType,
  JobTypeConvertor,
  salaryToString,
} from "helpers";
import React from "react";

const useStyles = makeStyles((theme) => ({
  block: {
    marginTop: 16,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: theme.palette.divider,
    "&:hover": {
      cursor: "pointer",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1) !important",
    },
  },
  blockPeriod: {
    fontSize: 18,
    color: theme.palette.text.secondary,
    marginBottom: 24,
  },
  blockDescription: {
    marginTop: 8,
    fontSize: 18,
    color: theme.palette.text.secondary,
    whiteSpace: "pre",
  },
}));

const JobGoalBlock: React.FC<JobGoal> = ({
  type,
  titles,
  salaryType,
  minSalary,
  maxSalary,
  fields,
  area,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.block}>
      <div className={classes.blockPeriod}>
        {"類型－" +
          (type ? JobTypeConvertor(jobGoalTypeToJobType(type)) : "不限")}
      </div>
      <div className={classes.blockPeriod}>
        {"職位－" + (titles && titles.length > 0 ? titles.join(" ") : "不限")}
      </div>
      <div className={classes.blockPeriod}>
        {"產業領域－" +
          (fields && fields.length > 0 ? fields.join(" ") : "不限")}
      </div>
      <div className={classes.blockPeriod}>{"地區－" + (area || "不限")}</div>
      <div className={classes.blockPeriod}>
        {"薪水－" +
          (salaryType && minSalary && maxSalary
            ? salaryToString(
                minSalary,
                maxSalary,
                jobGoalSalaryTypeToSalaryType(salaryType)
              )
            : "不限")}
      </div>
    </div>
  );
};

export { JobGoalBlock };
