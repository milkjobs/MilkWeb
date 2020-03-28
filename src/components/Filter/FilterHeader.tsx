import React, { useState } from "react";
import {
  AreaFilterButton,
  JobTypeFilterButton,
  ExperienceLevelFilterButton,
  EducationLevelFilterButton,
  TeamFieldFilterButton,
  SalaryFilterButton
} from ".";
import { makeStyles } from "@material-ui/core";
import { JobType, SalaryType } from "@frankyjuang/milkapi-client";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexDirection: "row"
  }
}));

const FilterHeader: React.FC = () => {
  const classes = useStyles();
  const [jobType, setJobType] = useState<JobType>();

  return (
    <div className={classes.container}>
      <AreaFilterButton attribute="area.level2" />
      <JobTypeFilterButton
        attribute="type"
        onChange={(type: JobType) => setJobType(type)}
      />
      {/* {jobType && (
        <SalaryFilterButton
          salaryType={
            jobType === JobType.Fulltime
              ? SalaryType.Monthly
              : SalaryType.Hourly
          }
        />
      )} */}
      <ExperienceLevelFilterButton attribute="experienceNeed" />
      <EducationLevelFilterButton attribute="educationNeed" />
      <TeamFieldFilterButton attribute="team.primaryField" />
    </div>
  );
};

export { FilterHeader };
