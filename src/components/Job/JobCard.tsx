import { Job } from "@frankyjuang/milkapi-client";
import React from "react";
import { JobCardBase } from "./JobCardBase";

interface Props extends Job {
  targetPath: string;
}

const JobCard: React.FC<Props> = (props) => {
  const {
    type,
    name,
    address,
    minSalary,
    maxSalary,
    salaryType,
    team,
    targetPath,
  } = props;

  return (
    <JobCardBase
      type={type}
      name={name}
      location={address.area + address.subArea}
      minSalary={minSalary}
      maxSalary={maxSalary}
      salaryType={salaryType}
      team={team}
      targetPath={targetPath}
    />
  );
};

export { JobCard };
