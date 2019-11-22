import { JobType, SalaryType, Team } from "@frankyjuang/milkapi-client";
import { makeStyles } from "@material-ui/core/styles";
import {
  salaryNumberToString,
  SalaryTypeToWordInJobCard,
  TeamSizeConvertor
} from "helpers";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTheme } from "stores";

const useStyles = makeStyles(theme => ({
  container: {
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 16,
    paddingBottom: 12,
    display: "flex",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: theme.palette.divider,
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      paddingLeft: 0,
      paddingRight: 0
    },
    "&:hover": {
      cursor: "pointer",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1) !important"
    }
  },
  jobContainer: {
    display: "flex",
    flex: 3,
    flexDirection: "column",
    overflow: "hidden",
    [theme.breakpoints.up("sm")]: {
      paddingRight: 48
    }
  },
  infoContainer: {
    display: "flex",
    flex: 1,
    alignItems: "center"
  },
  teamContainer: {
    display: "flex",
    flex: 2,
    overflow: "hidden",
    [theme.breakpoints.down("xs")]: {
      marginTop: 8
    }
  },
  teamInfo: {
    display: "flex",
    flex: 1,
    justifyContent: "space-around",
    flexDirection: "column",
    overflow: "hidden"
  },
  nameContainer: {
    display: "flex",
    flex: 1,
    alignItems: "center"
  },
  jobName: {
    display: "flex",
    flex: 3,
    color: theme.palette.text.primary,
    fontSize: 18,
    fontWeight: 800,
    marginRight: 16,
    overflow: "hidden",
    [theme.breakpoints.down("xs")]: {
      fontSize: 16
    }
  },
  jobSalary: {
    flex: 1,
    fontSize: 18,
    fontWeight: 400,
    color: theme.palette.secondary.main,
    [theme.breakpoints.down("xs")]: {
      fontSize: 16,
      marginLeft: "auto"
    }
  },
  teamName: {
    display: "flex",
    color: theme.palette.text.primary,
    fontSize: 18,
    fontWeight: 800,
    overflow: "hidden",
    [theme.breakpoints.down("xs")]: {
      fontSize: 16
    }
  },
  teamField: {
    display: "flex",
    fontSize: 16,
    color: theme.palette.text.primary,
    overflow: "hidden",
    [theme.breakpoints.down("xs")]: {
      fontSize: 14
    }
  },
  location: {
    display: "flex",
    alignItems: "center",
    flex: 3,
    color: theme.palette.text.primary,
    fontSize: 16,
    fontWeight: 400,
    [theme.breakpoints.down("xs")]: {
      fontSize: 14
    }
  },
  publish: {
    flex: 1,
    color: theme.palette.text.primary,
    fontSize: 16,
    fontWeight: 400,
    [theme.breakpoints.down("xs")]: {
      fontSize: 14
    }
  },
  logoContainer: {
    marginRight: 16,
    borderRadius: 8,
    backgroundColor: theme.palette.background.paper,
    width: 72,
    height: 72,
    [theme.breakpoints.down("xs")]: {
      width: 55,
      height: 55
    },
    [theme.breakpoints.only("sm")]: {
      display: "none"
    }
  },
  truncate: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }
}));

interface Props {
  type: JobType;
  name: string;
  location: string;
  minSalary: number;
  maxSalary: number;
  salaryType: SalaryType;
  team?: Pick<
    Team,
    "primaryField" | "secondaryField" | "logoUrl" | "nickname" | "size"
  >;
  targetPath: string;
  published: boolean;
}

const RecruiterJobCardBase: React.FC<Props> = props => {
  const {
    type,
    name,
    location,
    minSalary,
    maxSalary,
    salaryType,
    team,
    targetPath,
    published
  } = props;
  const classes = useStyles();
  const { theme } = useTheme();
  const history = useHistory();
  const [fields, setFields] = useState("");

  useEffect(() => {
    if (team) {
      let fieldsWords = team.primaryField;
      if (team.secondaryField) {
        fieldsWords = fieldsWords + "・" + team.secondaryField;
      }
      setFields(fieldsWords);
    }
  }, [team]);

  return (
    <div
      className={classes.container}
      onClick={() => {
        history.push(targetPath);
      }}
    >
      <div className={classes.jobContainer}>
        <div className={classes.nameContainer}>
          <div className={classes.jobName}>
            <div
              className={classes.truncate}
              style={{ color: published ? undefined : theme.palette.text.hint }}
            >
              {name}
            </div>
          </div>
          <div
            className={classes.jobSalary}
            style={{ color: published ? undefined : theme.palette.text.hint }}
          >
            {salaryNumberToString(minSalary) +
              "~" +
              salaryNumberToString(maxSalary) +
              SalaryTypeToWordInJobCard(salaryType)}
          </div>
        </div>
        <div className={classes.infoContainer}>
          <div
            className={classes.location}
            style={{ color: published ? undefined : theme.palette.text.hint }}
          >
            {location + (type === JobType.Internship ? "・實習" : "")}
          </div>
          <div
            className={classes.publish}
            style={{ color: published ? undefined : theme.palette.text.hint }}
          >
            {published ? "開放中" : "關閉中"}
          </div>
        </div>
      </div>
      {team && (
        <div className={classes.teamContainer}>
          <img
            alt="team logo"
            className={classes.logoContainer}
            src={team.logoUrl}
          />
          <div className={classes.teamInfo}>
            <div className={classes.teamName}>
              <div
                className={classes.truncate}
                style={{
                  color: published ? undefined : theme.palette.text.hint
                }}
              >
                {team.nickname}
              </div>
            </div>
            <div className={classes.teamField}>
              <div
                className={classes.truncate}
                style={{
                  color: published ? undefined : theme.palette.text.hint
                }}
              >
                {fields + "・" + TeamSizeConvertor(team.size)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { RecruiterJobCardBase };
