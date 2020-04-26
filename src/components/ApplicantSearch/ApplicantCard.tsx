import {
  JobGoal,
  Experience,
  Education,
  Project,
} from "@frankyjuang/milkapi-client";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import LinesEllipsis from "react-lines-ellipsis";
import { Link } from "react-router-dom";
import { Avatar, Button } from "@material-ui/core";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  container: {
    textDecoration: "none",
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
      paddingRight: 0,
    },
    "&:hover": {
      cursor: "pointer",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1) !important",
    },
  },
  applicantContainer: {
    display: "flex",
    width: "100%",
    overflow: "hidden",
    alignItems: "center",
  },
  nameContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
  },
  introductionContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    paddingLeft: 32,
  },
  jobGoal: {
    color: theme.palette.text.primary,
    textAlign: "left",
    marginBottom: 8,
  },
  introduction: {
    color: theme.palette.text.primary,
    textAlign: "left",
    fontSize: 14,
  },
  applicantName: {
    display: "flex",
    color: theme.palette.text.primary,
    fontSize: 16,
    fontWeight: 800,
    alignItems: "center",
    maxWidth: 80,
    overflow: "hidden",
    [theme.breakpoints.down("xs")]: {
      fontSize: 14,
    },
  },
  truncate: {
    marginLeft: "auto",
    marginRight: "auto",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  bigAvatar: {
    margin: 10,
    width: 60,
    height: 60,
  },
  label: {
    color: theme.palette.text.hint,
    marginBottom: 8,
    fontSize: 14,
    maxWidth: 300,
    whiteSpace: "pre-line",
    textAlign: "left",
  },
  userIntroduction: {
    color: theme.palette.text.primary,
    marginBottom: 8,
    fontSize: 14,
    whiteSpace: "pre-line",
    textAlign: "left",
  },
}));

interface Props {
  profileImageUrl: string;
  name: string;
  introduction: string;
  jobGoal: JobGoal;
  experiences: Experience[];
  educations: Education[];
  projects: Project[];
  targetPath: string;
}

const ApplicantCard: React.FC<Props> = (props) => {
  const {
    profileImageUrl,
    name,
    introduction,
    jobGoal,
    experiences,
    educations,
    projects,
    targetPath,
  } = props;
  const classes = useStyles();

  return (
    <Link to={targetPath} className={classes.container} target="_blank">
      <div className={classes.applicantContainer}>
        <div className={classes.nameContainer}>
          <Avatar
            alt={name}
            src={profileImageUrl}
            className={classes.bigAvatar}
          />
          <div className={classes.applicantName}>
            <div className={classes.truncate}>{name}</div>
          </div>
        </div>
        <div className={classes.introductionContainer}>
          {Boolean(jobGoal.titles?.length) && (
            <>
              <div className={classes.label}>求職目標</div>
              <div className={classes.jobGoal}>
                {jobGoal.titles?.join("、")}
              </div>
            </>
          )}
          <div className={classes.label}>自我介紹</div>
          <LinesEllipsis
            className={classes.introduction}
            text={introduction || "尚無"}
            maxLine="5"
            ellipsis="..."
            trimRight
            basedOn="letters"
          />
          {/* <div className={classes.introduction}>{introduction || "尚無"}</div> */}
        </div>
        <div className={classes.introductionContainer}>
          <div className={classes.label}>經驗</div>
          <div className={classes.userIntroduction}>
            {experiences?.slice(0, 2).map((e) => (
              <div
                key={e.uuid}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <div style={{ flex: 1 }}>{e.jobName + " - " + e.teamName}</div>
                <div style={{ flex: 1, textAlign: "right" }}>
                  {moment(e.startTime).calendar(undefined, {
                    sameDay: "MM/YYYY",
                    nextDay: "MM/YYYY",
                    nextWeek: "MM/YYYY",
                    lastDay: "MM/YYYY",
                    lastWeek: "MM/YYYY",
                    sameElse: "MM/YYYY",
                  }) +
                    " ~ " +
                    (e.endTime
                      ? moment(e.endTime).calendar(undefined, {
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
            ))}
          </div>
          <div className={classes.label}>學歷</div>
          <div className={classes.userIntroduction}>
            {educations?.slice(0, 2).map((e) => (
              <div
                key={e.uuid}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <div style={{ flex: 1 }}>
                  {e.schoolName + " - " + e.majorName}
                </div>
                <div style={{ flex: 1, textAlign: "right" }}>
                  {moment(e.startTime).calendar(undefined, {
                    sameDay: "MM/YYYY",
                    nextDay: "MM/YYYY",
                    nextWeek: "MM/YYYY",
                    lastDay: "MM/YYYY",
                    lastWeek: "MM/YYYY",
                    sameElse: "MM/YYYY",
                  }) +
                    " ~ " +
                    (e.endTime
                      ? moment(e.endTime).calendar(undefined, {
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
            ))}
          </div>
        </div>
        <Button
          style={{ marginLeft: 32, height: 40 }}
          variant={"contained"}
          color={"secondary"}
        >
          {"聊一聊"}
        </Button>
      </div>
    </Link>
  );
};

export { ApplicantCard };
