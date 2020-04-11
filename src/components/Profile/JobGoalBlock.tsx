import { makeStyles, useTheme } from "@material-ui/core/styles";
import React from "react";
import moment from "moment";
import { Project, JobGoal } from "@frankyjuang/milkapi-client";
import Linkify from "react-linkify";

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
  blockTitle: {
    fontSize: 18,
    color: theme.palette.text.secondary,
  },
  blockRow: {
    display: "flex",
    justifyContent: "space-between",
  },
  blockPeriod: {
    fontSize: 18,
    color: theme.palette.text.secondary,
  },
  blockDescription: {
    marginTop: 8,
    fontSize: 18,
    color: theme.palette.text.secondary,
    whiteSpace: "pre",
  },
}));

const JobGoalBlock: React.FC<JobGoal> = (props) => {
  const { name, salary, address } = props;
  const classes = useStyles();

  return (
    <div className={classes.block}>
      <div className={classes.blockRow}>
        <div className={classes.blockTitle}>{name}</div>
        <div className={classes.blockPeriod}>{salary}</div>
      </div>
      <div className={classes.blockDescription}>
        {address.area + address.subArea === "不限"
          ? ""
          : " - " + address.subArea}
      </div>
    </div>
  );
};

export { JobGoalBlock };
