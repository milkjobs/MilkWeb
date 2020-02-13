import { Job, PublicUser, Role, User } from "@frankyjuang/milkapi-client";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import to from "await-to-js";
import { salaryToString } from "helpers";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "stores";

const useStyles = makeStyles(theme =>
  createStyles({
    message: {
      margin: 16,
      display: "flex"
    },
    messageBody: {
      width: "auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      marginLeft: 16,
      marginRight: 16,
      paddingLeft: 16,
      paddingRight: 16,
      fontSize: 14,
      backgroundColor: "#eee",
      border: 1,
      borderRadius: 5
    },
    userCard: {
      width: "100%",
      paddingTop: 16,
      paddingBottom: 16,
      borderBottomStyle: "solid",
      borderBottomWidth: 1,
      borderBottomColor: theme.palette.divider,
      display: "flex",
      flexDirection: "column",
      cursor: "pointer",
      alignItems: "flex-start"
    },
    userIntroduction: {
      marginTop: 8,
      maxWidth: 300,
      whiteSpace: "pre-line",
      textAlign: "left"
    },
    jobCard: {
      paddingTop: 16,
      paddingBottom: 16,
      display: "flex",
      cursor: "pointer"
    }
  })
);

const ApplicationMessage: React.FC<Props> = props => {
  // Was the message sent by the current user. If so, add a css class
  const classes = useStyles();
  const history = useHistory();
  const { getApi, user } = useAuth();
  const { fromMe } = props;
  const [applicant, setApplicant] = useState<PublicUser | User>();
  const [job, setJob] = useState<Job>();

  const getData = useCallback(async () => {
    const data = JSON.parse(props.message.data);
    if (user && data.applicantId === user.uuid) {
      setApplicant(user);
    } else {
      const userApi = await getApi("User");
      const [, fetchedUser] = await to(
        userApi.getPublicUser({
          userId: data.applicantId,
          role: Role.Applicant
        })
      );
      setApplicant(fetchedUser);
    }
    if ("jobId" in data) {
      const jobId = data.jobId;
      const jobApi = await getApi("Job");
      const [, fetchedJob] = await to(jobApi.getJob({ jobId }));
      setJob(fetchedJob);
    }
  }, [getApi, props.message.data, user]);

  useEffect(() => {
    getData();
  }, [getData]);

  return !fromMe ? (
    <div className={classes.message}>
      <img alt="" src={props.profileUrl} width={40} height={40} />
      <div className={classes.messageBody}>
        {applicant && (
          <div className={classes.userCard}>
            <div>{applicant.name}</div>
            <div className={classes.userIntroduction}>
              {applicant.profile?.introduction || "尚無自我介紹"}
            </div>
          </div>
        )}
        {job && (
          <div
            className={classes.jobCard}
            onClick={() => history.push("/job/" + job.uuid)}
          >
            <div>{job.name}</div>
            <div style={{ marginLeft: 8 }}>
              {salaryToString(job.minSalary, job.maxSalary, job.salaryType)}
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div
      style={{
        justifyContent: "flex-end"
      }}
      className={classes.message}
    >
      <div className={classes.messageBody}>
        {applicant && (
          <div
            className={classes.userCard}
            onClick={() => history.push("/profile")}
          >
            <div>{applicant.name}</div>
            <div className={classes.userIntroduction}>
              {applicant.profile?.introduction || "尚無自我介紹"}
            </div>
          </div>
        )}
        {job && (
          <div
            className={classes.jobCard}
            onClick={() => history.push("/job/" + job.uuid)}
          >
            <div>{job.name}</div>
            <div style={{ marginLeft: 8 }}>
              {salaryToString(job.minSalary, job.maxSalary, job.salaryType)}
            </div>
          </div>
        )}
      </div>
      <img alt="" src={props.profileUrl} width={40} height={40} />
    </div>
  );
};

interface Props {
  profileUrl: string;
  message: SendBird.UserMessage;
  fromMe: boolean;
}

export { ApplicationMessage };

