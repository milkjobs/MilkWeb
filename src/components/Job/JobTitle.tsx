import { Job, JobType } from "@frankyjuang/milkapi-client";
import { makeStyles } from "@material-ui/core/styles";
import {
  EducationLevelConvertor,
  ExperienceLevelConvertor,
  salaryNumberToString,
  SalaryTypeToWordInJobCard,
  TeamSizeConvertor
} from "helpers";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  container: {
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 16,
    paddingBottom: 12,
    display: "flex",
    backgroundColor: theme.palette.background.paper,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: theme.palette.divider,
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      paddingLeft: 0,
      paddingRight: 0
    }
  },
  jobContainer: {
    flex: 2,
    display: "flex",
    flexDirection: "column"
  },
  teamContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    paddingLeft: 24,
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 0,
      marginTop: 16
    }
  },
  teamInfo: {
    display: "flex",
    flexDirection: "column"
  },
  nameContainer: {
    display: "flex",
    flex: 1
  },
  jobName: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "left",
    fontSize: 18,
    fontWeight: 800,
    color: theme.palette.text.primary,
    marginRight: 16,
    [theme.breakpoints.down("xs")]: {
      fontSize: 16
    }
  },
  jobSalary: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 18,
    fontWeight: 400,
    color: theme.palette.secondary.main,
    [theme.breakpoints.down("xs")]: {
      fontSize: 16,
      marginLeft: "auto",
      alignItems: "flex-start"
    }
  },
  teamName: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    fontSize: 18,
    fontWeight: 800,
    color: theme.palette.text.primary,
    marginRight: "auto",
    [theme.breakpoints.down("xs")]: {
      fontSize: 16
    }
  },
  teamField: {
    display: "flex",
    flex: 1,
    fontSize: 16,
    color: theme.palette.text.primary,
    marginRight: "auto",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      fontSize: 14
    }
  },
  location: {
    display: "flex",
    flex: 1,
    fontSize: 16,
    fontWeight: 400,
    marginRight: "auto",
    color: theme.palette.text.primary,
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      fontSize: 14,
      marginTop: 4
    }
  },
  logoContainer: {
    marginRight: 16,
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.down("xs")]: {
      width: 40,
      height: 40
    }
  }
}));

interface Props extends Job {
  teamLinkDisabled?: boolean;
}

const JobTitle: React.FC<Props> = props => {
  const {
    type,
    name,
    minSalary,
    maxSalary,
    salaryType,
    address,
    experienceNeed,
    educationNeed,
    team,
    teamLinkDisabled
  } = props;
  const classes = useStyles();
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
    <div className={classes.container}>
      <div className={classes.jobContainer}>
        <span className={classes.nameContainer}>
          <div className={classes.jobName}>{name}</div>
          <div className={classes.jobSalary}>
            {salaryNumberToString(minSalary) +
              "~" +
              salaryNumberToString(maxSalary) +
              SalaryTypeToWordInJobCard(salaryType)}
          </div>
        </span>
        <span className={classes.location}>
          {address.area +
            address.subArea +
            "・" +
            EducationLevelConvertor(educationNeed) +
            "・" +
            ExperienceLevelConvertor(experienceNeed) +
            (type === JobType.Internship ? "・實習" : "")}
        </span>
      </div>
      {team &&
        (teamLinkDisabled ? (
          <div className={classes.teamContainer}>
            <img
              alt="team logo"
              className={classes.logoContainer}
              src={team.logoUrl}
            />
            <div className={classes.teamInfo}>
              <div className={classes.teamName}>{team.nickname}</div>
              <div className={classes.teamField}>
                {fields + "・" + TeamSizeConvertor(team.size)}
              </div>
            </div>
          </div>
        ) : (
          <Link
            to={"/team/" + team.uuid}
            style={{ textDecoration: "none", cursor: "pointer" }}
            className={classes.teamContainer}
          >
            <img
              alt="team logo"
              className={classes.logoContainer}
              src={team.logoUrl}
            />
            <div className={classes.teamInfo}>
              <div className={classes.teamName}>{team.nickname}</div>
              <div className={classes.teamField}>
                {fields + "・" + TeamSizeConvertor(team.size)}
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
};

export { JobTitle };
