import { JobGoal } from "@frankyjuang/milkapi-client";
import { makeStyles } from "@material-ui/core/styles";
import {
  jobGoalSalaryTypeToSalaryType,
  jobGoalTypeToJobType,
  JobTypeConvertor,
  salaryToString,
} from "helpers";
import React from "react";
import WorkOutlineIcon from "@material-ui/icons/WorkOutline";
import BusinessIcon from "@material-ui/icons/Business";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";

const useStyles = makeStyles((theme) => ({
  block: {
    display: "flex",
    flexDirection: "column",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: theme.palette.divider,
    "&:hover": {
      cursor: "pointer",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1) !important",
    },
  },
  blockRow: {
    display: "flex",
  },
  blockPeriod: {
    display: "flex",
    alignItems: "center",
    fontSize: 16,
    color: theme.palette.text.secondary,
  },
  blockIcon: {
    marginRight: 8,
  },
  blockDivider: {
    fontSize: 16,
    color: theme.palette.text.secondary,
    marginRight: 16,
    marginLeft: 16,
  },
  blockDescription: {
    marginTop: 8,
    fontSize: 16,
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
      <div className={classes.blockRow} style={{ marginBottom: 16 }}>
        <div className={classes.blockPeriod}>
          <WorkOutlineIcon className={classes.blockIcon} />
          <div>
            {type ? JobTypeConvertor(jobGoalTypeToJobType(type)) : "不限"}
          </div>
        </div>
        <div className={classes.blockDivider}>{" | "}</div>
        <div className={classes.blockPeriod}>
          <WorkOutlineIcon className={classes.blockIcon} />
          <div>{titles && titles.length > 0 ? titles.join(" ") : "不限"}</div>
        </div>
      </div>
      <div className={classes.blockRow}>
        <div className={classes.blockPeriod}>
          <BusinessIcon className={classes.blockIcon} />
          <div>{fields && fields.length > 0 ? fields.join(" ") : "不限"}</div>
        </div>
        <div className={classes.blockDivider}>{" | "}</div>
        <div className={classes.blockPeriod}>
          <LocationOnIcon className={classes.blockIcon} />
          <div>{area || "不限"}</div>
        </div>
        <div className={classes.blockDivider}>{" | "}</div>
        <div className={classes.blockPeriod}>
          <AttachMoneyIcon className={classes.blockIcon} />
          <div>
            {salaryType && minSalary && maxSalary
              ? salaryToString(
                  minSalary,
                  maxSalary,
                  jobGoalSalaryTypeToSalaryType(salaryType)
                )
              : "不限"}
          </div>
        </div>
      </div>
    </div>
  );
};

export { JobGoalBlock };
