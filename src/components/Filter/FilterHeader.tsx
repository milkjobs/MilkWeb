import React, { useState } from "react";
import {
  AreaFilterButton,
  JobTypeFilterButton,
  ExperienceLevelFilterButton,
  EducationLevelFilterButton,
  TeamFieldFilterButton,
  SortButton,
} from ".";
import { makeStyles } from "@material-ui/core";
import { JobType, SalaryType } from "@frankyjuang/milkapi-client";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "row",
  },
}));

const FilterHeader: React.FC = () => {
  const classes = useStyles();
  const [jobType, setJobType] = useState<JobType>();

  return (
    <div className={classes.container}>
      {/* <SortButton
        defaultRefinement={"jobs_staging"}
        items={[
          { value: "jobs_staging", label: "最新" },
          { value: "jobs_staging_hot", label: "熱門" },
        ]}
      /> */}
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
      <TeamFieldFilterButton attribute="team.primaryField" limit={50} />
    </div>
  );
};

export { FilterHeader };
