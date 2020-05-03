import React, { useState } from "react";
import { AreaFilterButton } from ".";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "row",
  },
}));

const FilterHeader: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <AreaFilterButton attribute="jobGoal.areas" />
    </div>
  );
};

export { FilterHeader };
