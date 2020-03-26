import React from "react";
import { AreaFilterButton, JobTypeFilterButton } from ".";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexDirection: "row"
  }
}));

const FilterHeader: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <AreaFilterButton attribute="area.level2" />
      <JobTypeFilterButton attribute="type" />
    </div>
  );
};

export { FilterHeader };
