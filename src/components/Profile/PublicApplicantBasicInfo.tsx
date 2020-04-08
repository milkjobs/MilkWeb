import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "stores";
import moment from "moment";
import {
  Experience,
  Education,
  PublicUser,
  Role,
} from "@frankyjuang/milkapi-client";
import to from "await-to-js";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 12,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 16,
    marginBottom: 8,
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.up("sm")]: {
      width: "600px",
    },
  },
  info: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 24,
  },
  name: {
    fontSize: 30,
    fontWeight: "bold",
    color: theme.palette.text.primary,
  },
  detail: {
    display: "flex",
    flex: 1,
    fontSize: 16,
    color: "#4A4A4A",
  },
  description: {
    display: "flex",
    whiteSpace: "pre-line",
    textAlign: "left",
    flex: 1,
    fontSize: 16,
    marginTop: 32,
    color: theme.palette.text.secondary,
  },
  items: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    flex: 1,
    marginTop: 32,
  },
  title: {
    display: "flex",
    whiteSpace: "pre-line",
    textAlign: "left",
    flex: 1,
    fontSize: 20,
    color: theme.palette.text.primary,
  },
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
  },
  blockAdd: {
    color: theme.palette.secondary.main,
    margin: 8,
    padding: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    "&:hover": {
      cursor: "pointer",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1) !important",
    },
  },
  button: {
    marginLeft: theme.spacing(2),
  },
  formContainer: {
    display: "flex",
    flexWrap: "wrap",
    marginTop: 8,
  },
  formControl: {
    marginRight: theme.spacing(2),
    minWidth: 115,
  },
  formTextInput: {
    marginBottom: 12,
  },
}));

const ExperienceBlock: React.FC<Experience> = (props) => {
  const { jobName, teamName, startTime, endTime, description } = props;
  const classes = useStyles();
  return (
    <div className={classes.block}>
      <div className={classes.blockRow}>
        <div className={classes.blockTitle}>{jobName + "・" + teamName}</div>
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
      <div className={classes.blockDescription}>{description}</div>
    </div>
  );
};

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
      <div className={classes.blockDescription}>{description}</div>
    </div>
  );
};

interface Props {
  userId: string;
}

const PublicApplicantBasicInfo: React.FC<Props> = ({ userId }) => {
  const classes = useStyles();
  const { getApi } = useAuth();
  const [user, setUser] = useState<PublicUser>();

  const getPublicUser = async () => {
    const userApi = await getApi("User");
    const [err, publicUser] = await to(
      userApi.getPublicUser({ userId, role: Role.Applicant })
    );
    publicUser && setUser(publicUser);
  };

  useEffect(() => {
    getPublicUser();
  }, [userId]);

  return (
    <div className={classes.container}>
      {user && (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Avatar
              alt="profile image"
              src={user.profileImageUrl}
              style={{ width: 60, height: 60 }}
            />
            <div className={classes.info}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginBottom: 8,
                }}
              >
                <div className={classes.name}>{user.name}</div>
              </div>
            </div>
          </div>
          <div className={classes.description}>
            {user.profile?.introduction || "尚無自我介紹"}
          </div>
          <div className={classes.items}>
            <div className={classes.title}>{"經歷"}</div>
            {(user.profile?.experiences || []).map((e) => (
              <div key={e.uuid}>
                <ExperienceBlock {...e} />
              </div>
            ))}
          </div>
          <div className={classes.items}>
            <div className={classes.title}>{"學歷"}</div>
            {(user.profile?.educations || []).map((e) => (
              <div key={e.uuid}>
                <EducationBlock {...e} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export { PublicApplicantBasicInfo };
