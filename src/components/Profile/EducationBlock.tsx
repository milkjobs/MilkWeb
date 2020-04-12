import { makeStyles, useTheme } from "@material-ui/core/styles";
import React from "react";
import moment from "moment";
import { Education } from "@frankyjuang/milkapi-client";
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
    whiteSpace: "pre-line",
  },
}));

const EducationBlock: React.FC<Education> = (props) => {
  const {
    schoolName,
    degree,
    majorName,
    startTime,
    endTime,
    description,
  } = props;
  const classes = useStyles();
  const theme = useTheme();

  return (
    <div className={classes.block}>
      <div className={classes.blockRow}>
        <div className={classes.blockTitle}>
          {schoolName + "・" + degree + "・" + majorName}
        </div>
        <div className={classes.blockPeriod}>
          {moment(startTime).calendar(undefined, {
            sameDay: "MM/YYYY",
            nextDay: "MM/YYYY",
            nextWeek: "MM/YYYY",
            lastDay: "MM/YYYY",
            lastWeek: "MM/YYYY",
            sameElse: "MM/YYYY",
          }) +
            " ~ " +
            (endTime
              ? moment(endTime).calendar(undefined, {
                  sameDay: "MM/YYYY",
                  nextDay: "MM/YYYY",
                  nextWeek: "MM/YYYY",
                  lastDay: "MM/YYYY",
                  lastWeek: "MM/YYYY",
                  sameElse: "MM/YYYY",
                })
              : "至今")}
        </div>
      </div>
      <div className={classes.blockDescription}>
        <Linkify
          properties={{
            target: "_blank",
            style: {
              color: theme.palette.secondary.main,
              textDecoration: "none",
            },
          }}
        >
          {description}
        </Linkify>
      </div>
    </div>
  );
};

export { EducationBlock };
