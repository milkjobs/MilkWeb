import React, { useState } from "react";
import {
  AreaFilterButton,
  JobTypeFilterButton,
  ExperienceLevelFilterButton,
  EducationLevelFilterButton,
  TeamFieldFilterButton,
} from ".";
import { useMediaQuery } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { JobType } from "@frankyjuang/milkapi-client";
import { useSearch } from "stores";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
  },
  selectedOption: {
    color: theme.palette.text.primary,
    fontSize: 16,
    padding: 8,
    borderBottomColor: theme.palette.text.primary,
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    cursor: "pointer",
  },
  option: {
    color: theme.palette.text.secondary,
    fontSize: 16,
    padding: 8,
    cursor: "pointer",
  },
}));

const FilterHeader: React.FC = () => {
  const classes = useStyles();
  const { jobRecommend, setJobRecommend } = useSearch();
  const [jobType, setJobType] = useState<JobType>();
  const matched = useMediaQuery((theme: Theme) => theme.breakpoints.down("xs"));

  return (
    <div className={classes.container}>
      {/* <SortButton
        defaultRefinement={"jobs_staging"}
        items={[
          { value: "jobs_staging", label: "最新" },
          { value: "jobs_staging_hot", label: "熱門" },
        ]}
      /> */}
      <div
        className={jobRecommend ? classes.selectedOption : classes.option}
        onClick={() => setJobRecommend(true)}
      >
        {"推薦"}
      </div>
      <div
        className={jobRecommend ? classes.option : classes.selectedOption}
        onClick={() => setJobRecommend(false)}
      >
        {"最新"}
      </div>
      <div style={{ marginLeft: "auto" }}>
        <AreaFilterButton attribute="area.level2" />
        <JobTypeFilterButton
          attribute="type"
          onChange={(type: JobType) => setJobType(type)}
        />
        {!matched && (
          <>
            <ExperienceLevelFilterButton attribute="experienceNeed" />
            <EducationLevelFilterButton attribute="educationNeed" />
            <TeamFieldFilterButton attribute="team.primaryField" limit={50} />
          </>
        )}
      </div>
    </div>
  );
};

export { FilterHeader };
