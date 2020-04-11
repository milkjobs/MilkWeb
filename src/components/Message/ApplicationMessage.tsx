import { Job, PublicUser, Role } from "@frankyjuang/milkapi-client";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Skeleton } from "@material-ui/lab";
import to from "await-to-js";
import { salaryToString } from "helpers";
import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useAuth } from "stores";
import { getMetadata } from "./utils";
import moment from "moment";

const useStyles = makeStyles((theme) =>
  createStyles({
    message: {
      margin: 16,
      display: "flex",
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
      borderRadius: 5,
    },
    userCard: {
      width: "100%",
      paddingBottom: 16,
      borderBottomStyle: "solid",
      borderBottomWidth: 1,
      borderBottomColor: theme.palette.divider,
      display: "flex",
      flexDirection: "column",
      cursor: "pointer",
      alignItems: "flex-start",
    },
    userIntroduction: {
      marginTop: 8,
      maxWidth: 300,
      whiteSpace: "pre-line",
      textAlign: "left",
    },
    jobCard: {
      paddingTop: 16,
      paddingBottom: 16,
      display: "flex",
      cursor: "pointer",
    },
    link: {
      textDecoration: "none",
      color: theme.palette.text.primary,
    },
  })
);

interface ProfileMessageProps {
  applicant: PublicUser;
}

const ProfileMessage: React.FC<ProfileMessageProps> = ({ applicant }) => {
  const classes = useStyles();
  return (
    <div>
      <div>{applicant.name}</div>
      <div className={classes.userIntroduction}>
        {applicant.profile?.introduction || "尚無自我介紹"}
      </div>
      <div className={classes.userIntroduction}>經驗</div>
      <div className={classes.userIntroduction}>
        {applicant.profile?.experiences?.map((e) => (
          <div key={e.uuid}>
            <div>{e.jobName + " - " + e.teamName}</div>
            <div>
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
      <div className={classes.userIntroduction}>學歷</div>
      <div className={classes.userIntroduction}>
        {applicant.profile?.educations?.map((e) => (
          <div key={e.uuid}>
            <div>{e.schoolName + " - " + e.majorName}</div>
            <div>
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
  );
};

interface Props {
  profileUrl: string;
  message: SendBird.UserMessage;
  fromMe: boolean;
}

const ApplicationMessage: React.FC<Props> = ({
  profileUrl,
  message,
  fromMe,
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
              role: Role.Applicant,
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
      <div
        className={classes.messageBody}
        style={applicantLoading && jobLoading ? { minWidth: 160 } : undefined}
      >
        {applicantLoading ? (
          <>
            <Skeleton width="60%" />
            <Skeleton width="100%" />
            <Skeleton width="90%" />
          </>
        ) : (
          <div className={classes.userCard}>
            {applicant ? (
              <Link
                className={classes.link}
                to={"/public-profile/" + applicant.uuid}
                target={"_blank"}
              >
                <ProfileMessage applicant={applicant} />
              </Link>
            ) : (
              <div>求職者已離開</div>
            )}
          </div>
        )}
        {jobLoading ? (
          <Skeleton width="100%" style={{ marginTop: 16, marginBottom: 16 }} />
        ) : (
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
        )}
      </div>
    </div>
  ) : (
    <div
      style={{
        justifyContent: "flex-end",
      }}
      className={classes.message}
    >
      <div
        className={classes.messageBody}
        style={applicantLoading && jobLoading ? { minWidth: 160 } : undefined}
      >
        {applicantLoading ? (
          <>
            <Skeleton width="60%" />
            <Skeleton width="100%" />
            <Skeleton width="90%" />
          </>
        ) : (
          <div
            className={classes.userCard}
            onClick={() => history.push("/profile")}
          >
            {applicant ? (
              <ProfileMessage applicant={applicant} />
            ) : (
              <div>求職者已離開</div>
            )}
          </div>
        )}
        {jobLoading ? (
          <Skeleton width="100%" style={{ marginTop: 16, marginBottom: 16 }} />
        ) : (
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
        )}
      </div>
      <img alt="profile image" src={profileUrl} width={40} height={40} />
    </div>
  );
};

export { ApplicationMessage };
