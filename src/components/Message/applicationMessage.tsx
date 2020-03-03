import { Job, PublicUser, Role } from "@frankyjuang/milkapi-client";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import to from "await-to-js";
import { salaryToString } from "helpers";
import React, { useEffect, useState } from "react";
import ReactPlaceholder from "react-placeholder";
import "react-placeholder/lib/reactPlaceholder.css";
import { useHistory } from "react-router-dom";
import { useAuth } from "stores";
import { getMetadata } from "./utils";

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
      paddingTop: 8,
      paddingBottom: 8,
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

interface Props {
  profileUrl: string;
  message: SendBird.UserMessage;
  fromMe: boolean;
}

const ApplicationMessage: React.FC<Props> = ({
  profileUrl,
  message,
  fromMe
}) => {
  const classes = useStyles();
  const history = useHistory();
  const { getApi, user } = useAuth();
  const [applicant, setApplicant] = useState<PublicUser>();
  const [applicantLoading, setApplicantLoading] = useState(true);
  const [job, setJob] = useState<Job>();
  const [jobLoading, setJobLoading] = useState(true);

  useEffect(() => {
    const getJob = async () => {
      setJobLoading(true);
      const metadata = getMetadata(message);
      if (metadata && "applicantId" in metadata) {
        const jobApi = await getApi("Job");
        const [, fetchedJob] = await to(
          jobApi.getJob({ jobId: metadata.jobId })
        );
        setJob(fetchedJob);
      }
      setJobLoading(false);
    };

    getJob();
  }, [getApi, message]);

  useEffect(() => {
    const getApplicant = async () => {
      setApplicantLoading(true);
      const metadata = getMetadata(message);
      if (user && metadata && "applicantId" in metadata) {
        if (metadata.applicantId === user.uuid) {
          setApplicant(user);
        } else {
          const userApi = await getApi("User");
          const [, fetchedUser] = await to(
            userApi.getPublicUser({
              userId: metadata.applicantId,
              role: Role.Applicant
            })
          );
          setApplicant(fetchedUser);
        }
      }
      setApplicantLoading(false);
    };

    getApplicant();
  }, [getApi, message, user]);

  return !fromMe ? (
    <div className={classes.message}>
      <img alt="" src={profileUrl} width={40} height={40} />
      <div className={classes.messageBody}>
        <ReactPlaceholder
          style={{ minWidth: 160 }}
          type="text"
          showLoadingAnimation
          ready={!applicantLoading}
        >
          <div className={classes.userCard}>
            {applicant ? (
              <>
                <div>{applicant.name}</div>
                <div className={classes.userIntroduction}>
                  {applicant.profile?.introduction || "尚無自我介紹"}
                </div>
              </>
            ) : (
              <div>求職者已離開</div>
            )}
          </div>
        </ReactPlaceholder>
        <ReactPlaceholder
          style={{ minWidth: 160 }}
          type="text"
          rows={1}
          showLoadingAnimation
          ready={!jobLoading}
        >
          <div
            className={classes.jobCard}
            onClick={job ? () => history.push(`/job/${job.uuid}`) : undefined}
          >
            {job ? (
              <>
                <div>{job.name}</div>
                <div style={{ marginLeft: 8 }}>
                  {salaryToString(job.minSalary, job.maxSalary, job.salaryType)}
                </div>
              </>
            ) : (
              <div>職缺已關閉</div>
            )}
          </div>
        </ReactPlaceholder>
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
        <ReactPlaceholder
          style={{ minWidth: 160 }}
          type="text"
          showLoadingAnimation
          ready={!applicantLoading}
        >
          <div
            className={classes.userCard}
            onClick={() => history.push("/profile")}
          >
            {applicant ? (
              <>
                <div>{applicant.name}</div>
                <div className={classes.userIntroduction}>
                  {applicant.profile?.introduction || "尚無自我介紹"}
                </div>
              </>
            ) : (
              <div>求職者已離開</div>
            )}
          </div>
        </ReactPlaceholder>
        <ReactPlaceholder
          style={{ minWidth: 160 }}
          type="text"
          rows={1}
          showLoadingAnimation
          ready={!jobLoading}
        >
          <div
            className={classes.jobCard}
            onClick={job ? () => history.push(`/job/${job.uuid}`) : undefined}
          >
            {job ? (
              <>
                <div>{job.name}</div>
                <div style={{ marginLeft: 8 }}>
                  {salaryToString(job.minSalary, job.maxSalary, job.salaryType)}
                </div>
              </>
            ) : (
              <div>職缺已關閉</div>
            )}
          </div>
        </ReactPlaceholder>
      </div>
      <img alt="" src={profileUrl} width={40} height={40} />
    </div>
  );
};

export { ApplicationMessage };
