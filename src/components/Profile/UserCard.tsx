import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import WorkOutlineIcon from "@material-ui/icons/WorkOutline";
import BusinessIcon from "@material-ui/icons/Business";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import { useAuth } from "stores";
import { Avatar, Button } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import LinesEllipsis from "react-lines-ellipsis";
import { JobGoal } from "@frankyjuang/milkapi-client";
import { DownloadApp, LoginDialog } from "components/Util";
import {
  jobGoalSalaryTypeToSalaryType,
  jobGoalTypeToJobType,
  JobTypeConvertor,
  salaryToString,
} from "helpers";
import moment from "moment";
import applicantCover from "assets/applicantCover.jpeg";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    width: 250,
    padding: 16,
    paddingTop: 24,
    paddingBottom: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.palette.divider,
  },
  row: {
    display: "flex",
    alignItems: "center",
  },
  loginAvatar: {
    width: 80,
    height: 80,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 16,
  },
  avatar: {
    width: 30,
    height: 30,
  },
  name: {
    fontWeight: "bold",
    textAlign: "left",
    fontSize: 18,
    marginLeft: 16,
  },
  introduction: {
    maxWidth: 200,
    textAlign: "left",
    marginTop: 12,
    color: theme.palette.text.primary,
  },
  title: {
    marginTop: 12,
    color: theme.palette.text.hint,
  },
  text: {
    color: theme.palette.text.primary,
  },
  link: {
    textDecoration: "none",
    color: theme.palette.secondary.main,
    marginLeft: "auto",
  },
  blockPeriod: {
    display: "flex",
    textAlign: "left",
    alignItems: "center",
    whiteSpace: "pre",
    fontSize: 14,
    color: theme.palette.text.primary,
  },
  blockIcon: {
    marginRight: 4,
    fontSize: 14,
  },
  blockDivider: {
    fontSize: 14,
    color: theme.palette.text.secondary,
    marginRight: 8,
    marginLeft: 8,
  },
  applicantCover: {
    cursor: "pointer",
    width: 250,
    borderRadius: 8,
  },
}));

const JobGoalRow: React.FC<JobGoal> = ({
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
    <>
      <div className={classes.row} style={{ marginTop: 8 }}>
        <div className={classes.blockPeriod}>
          <WorkOutlineIcon className={classes.blockIcon} />
          <div>
            {type ? JobTypeConvertor(jobGoalTypeToJobType(type)) : "不限"}
          </div>
        </div>
        <div className={classes.blockDivider} style={{ margin: 0 }}>
          {"・"}
        </div>
        <div className={classes.blockPeriod}>
          {titles && titles.length > 0 ? titles.join("\n") : "不限"}
        </div>
      </div>
      <div className={classes.row}>
        <div className={classes.blockPeriod}>
          <LocationOnIcon className={classes.blockIcon} />
          <div>{area || "不限"}</div>
        </div>
        <div className={classes.blockPeriod} style={{ marginLeft: 4 }}>
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
    </>
  );
};

const UserCard: React.FC = ({}) => {
  const classes = useStyles();
  const { user } = useAuth();
  const history = useHistory();
  const [downloadAppOpen, setDownloadAppOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      {!user ? (
        <>
          <Alert
            severity="info"
            style={{ marginBottom: 8, maxWidth: 250, cursor: "pointer" }}
            onClick={() => setLoginOpen(true)}
          >
            {`登入牛奶找工作，\n每週推薦最新職缺給你！`}
          </Alert>
          <div className={classes.container}>
            <Avatar src={""} className={classes.loginAvatar} />
            <Button
              variant={"contained"}
              color={"secondary"}
              style={{ width: "100%" }}
              onClick={() => setLoginOpen(true)}
            >
              {"登入"}
            </Button>
          </div>
        </>
      ) : (
        <>
          {(user.profile?.educations === undefined ||
            user.profile?.educations.length === 0 ||
            user.profile?.jobGoal?.titles === undefined ||
            user.profile?.jobGoal?.titles.length === 0) && (
            <Alert
              severity="info"
              style={{ marginBottom: 8, maxWidth: 250, cursor: "pointer" }}
              onClick={() => history.push("/profile")}
            >
              {`留下你的求職目標、學經歷，每週推薦最新職缺給你！`}
            </Alert>
          )}
          <div className={classes.container}>
            <div className={classes.row}>
              <Avatar src={user.profileImageUrl} className={classes.avatar} />
              <div className={classes.name}>{user.name}</div>
              <Link to={"/profile"} className={classes.link}>
                {"編輯"}
              </Link>
            </div>
            <div className={classes.row}>
              <LinesEllipsis
                className={classes.introduction}
                text={user.profile?.introduction || "尚無自我介紹"}
                maxLine="5"
                ellipsis="..."
                trimRight
                basedOn="letters"
              />
            </div>
            <div className={classes.row}>
              <div className={classes.title}>{"求職目標"}</div>
            </div>
            <JobGoalRow {...user.profile?.jobGoal} />
            <div className={classes.row}>
              <div className={classes.title}>{"經歷"}</div>
            </div>
            {user.profile?.experiences?.slice(0, 1).map((e) => (
              <div
                key={e.uuid}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "left",
                  marginTop: 8,
                }}
              >
                <div style={{ textAlign: "left" }}>
                  {e.jobName + " - " + e.teamName}
                </div>
                <div style={{ textAlign: "left" }}>
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
            <div className={classes.row}>
              <div className={classes.title}>{"學歷"}</div>
            </div>
            {user.profile?.educations?.slice(0, 1).map((e) => (
              <div
                key={e.uuid}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "left",
                  marginTop: 8,
                }}
              >
                <div style={{ textAlign: "left" }}>
                  {e.schoolName + " - " + e.majorName}
                </div>
                <div style={{ textAlign: "left" }}>
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
            {!user.profile?.resumeKey && (
              <Link
                to={"/resume"}
                style={{ marginTop: 16, textDecoration: "none", width: "100%" }}
              >
                <Button
                  variant={"contained"}
                  color={"secondary"}
                  style={{ width: "100%" }}
                >
                  {"上傳履歷附件"}
                </Button>
              </Link>
            )}
          </div>
        </>
      )}
      <img
        alt="logo"
        className={classes.applicantCover}
        src={applicantCover}
        onClick={() => setDownloadAppOpen(true)}
      />
      <DownloadApp
        isOpen={downloadAppOpen}
        close={() => setDownloadAppOpen(false)}
      />
      <LoginDialog isOpen={loginOpen} close={() => setLoginOpen(false)} />
    </>
  );
};

export { UserCard };
