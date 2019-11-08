import { JobRecord } from "@frankyjuang/milkapi-client";
import React from "react";
import { JobCardBase } from "./JobCardBase";

interface Props extends JobRecord {
  targetPath: string;
}

const JobRecordCard: React.FC<Props> = props => {
  const {
    type,
    name,
    area,
    minSalary,
    maxSalary,
    salaryType,
    team,
    targetPath
  } = props;

  return (
    <JobCardBase
      type={type}
      name={name}
      location={area.level2.replace(/[>\s]+/g, "")}
      minSalary={minSalary}
      maxSalary={maxSalary}
      salaryType={salaryType}
      team={team}
      targetPath={targetPath}
    />
  );
};

export { JobRecordCard };
