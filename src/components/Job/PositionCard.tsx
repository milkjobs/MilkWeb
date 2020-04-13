import { Job } from "@frankyjuang/milkapi-client";
import React from "react";
import { PositionCardBase } from "./PositionCardBase";

interface Props extends Job {
  targetPath: string;
}

const PositionCard: React.FC<Props> = (props) => {
  const {
    type,
    name,
    address,
    minSalary,
    maxSalary,
    salaryType,
    team,
    targetPath,
    published,
  } = props;

  return (
    <PositionCardBase
      type={type}
      name={name}
      location={address.area + address.subArea}
      minSalary={minSalary}
      maxSalary={maxSalary}
      salaryType={salaryType}
      team={team}
      targetPath={targetPath}
      published={published}
    />
  );
};

export { PositionCard };
