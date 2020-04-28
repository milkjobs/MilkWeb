import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState, useCallback } from "react";
import { useAuth, useChannel } from "stores";
import { PublicUser, Role } from "@frankyjuang/milkapi-client";
import to from "await-to-js";
import { ExperienceBlock, EducationBlock, ProjectBlock, JobGoalBlock } from ".";
import { Button } from "@material-ui/core";
import { JobCard } from "components/Job";
import { LoginDialog } from "components/Util";
import { useHistory, useLocation } from "react-router-dom";
import SendBird from "sendbird";

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
      width: "100%",
      maxWidth: "900px",
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
    fontSize: 18,
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

interface Props {
  userId: string;
}

const PublicApplicantBasicInfo: React.FC<Props> = ({ userId }) => {
  const classes = useStyles();
  const { getApi, user } = useAuth();
  const { sb } = useChannel();
  const location = useLocation();
  const [applicant, setApplicant] = useState<PublicUser>();
  const [recruiter, setRecruiter] = useState<PublicUser>();
  const [recruiterMode, setRecruiterMode] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const history = useHistory();
  const isRecruiter = location.pathname.startsWith("/recruiter");

  const createChannel = async (
    members: string[]
  ): Promise<SendBird.GroupChannel> => {
    return new Promise((resolve, reject) => {
      const sb = SendBird.getInstance();
      sb.GroupChannel.createChannelWithUserIds(
        members,
        false,
        members.join("_"),
        "",
        "",
        (channel, error) => {
          error ? reject(error) : resolve(channel);
        }
      );
    });
  };

  const getOrCreateChannel = useCallback(async () => {
    if (user && sb) {
      const members = [user.uuid, userId];
      // Check there is an application or not
      const filteredQuery = sb.GroupChannel.createMyGroupChannelListQuery();
      filteredQuery.userIdsIncludeFilter = members;
      filteredQuery.next(async (groupChannels) => {
        let channel = groupChannels.find(
          (c) =>
            (c.name === members.join("_") ||
              c.name === members.reverse().join("_")) &&
            c.members.some((m) => m.userId === user.uuid) &&
            c.members.some((m) => m.userId === userId)
        );
        if (!channel) {
          channel = await createChannel(members);
        }

        if (isRecruiter) history.push("/recruiter/message" + channel.url);
        else history.push("/message/" + channel.url);
      });
    }
  }, [user, sb]);

  const getPublicUser = async () => {
    const userApi = await getApi("User");
    const [err, publicUser] = await to(
      userApi.getPublicUser({ userId, role: Role.Applicant })
    );
    publicUser && setApplicant(publicUser);
    const [errR, publicRecruiter] = await to(
      userApi.getPublicUser({ userId, role: Role.Recruiter })
    );
    publicRecruiter && setRecruiter(publicRecruiter);
  };

  useEffect(() => {
    getPublicUser();
  }, [userId]);

  return (
    <div className={classes.container}>
      {applicant && (
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
              src={applicant.profileImageUrl}
              style={{ width: 60, height: 60 }}
            />
            <div className={classes.info}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div className={classes.name}>{applicant.name}</div>
                {recruiterMode && (
                  <div style={{ textAlign: "left", fontSize: 16 }}>
                    {recruiter?.title}
                  </div>
                )}
              </div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex" }}>
              {user && user.uuid !== userId && (
                <Button
                  variant={"outlined"}
                  style={{ marginRight: 8 }}
                  onClick={async () => {
                    if (!user) {
                      setLoginDialogOpen(true);
                      return;
                    }

                    await getOrCreateChannel();
                  }}
                >
                  {"發訊息"}
                </Button>
              )}
              {recruiter &&
                !recruiterMode &&
                recruiter.jobs?.length !== undefined &&
                recruiter.jobs?.length !== 0 && (
                  <Button
                    variant={"outlined"}
                    onClick={() => setRecruiterMode(true)}
                  >{`職缺 ( ${recruiter.jobs?.length} ) `}</Button>
                )}
              {recruiterMode && (
                <Button
                  variant={"outlined"}
                  onClick={() => setRecruiterMode(false)}
                >{`個人主頁`}</Button>
              )}
            </div>
          </div>
          {recruiterMode ? (
            <div style={{ marginTop: 32 }}>
              {recruiter?.jobs?.map((j) => (
                <JobCard
                  {...j}
                  key={j.uuid}
                  targetPath={`/job/${j.uuid}`}
                  team={recruiter.team}
                />
              ))}
            </div>
          ) : (
            <>
              <div className={classes.description}>
                {applicant.profile?.introduction || "尚無自我介紹"}
              </div>
              <div className={classes.items}>
                <div className={classes.title}>{"經歷"}</div>
                {(applicant.profile?.experiences || []).map((e) => (
                  <div key={e.uuid}>
                    <ExperienceBlock {...e} />
                  </div>
                ))}
              </div>
              <div className={classes.items}>
                <div className={classes.title}>{"學歷"}</div>
                {(applicant.profile?.educations || []).map((e) => (
                  <div key={e.uuid}>
                    <EducationBlock {...e} />
                  </div>
                ))}
              </div>
              <div className={classes.items}>
                <div className={classes.title}>{"作品"}</div>
                {(applicant.profile?.projects || []).map((e) => (
                  <div key={e.uuid}>
                    <ProjectBlock {...e} />
                  </div>
                ))}
              </div>
              <div className={classes.items}>
                <div className={classes.title}>{"求職目標"}</div>
                {applicant.profile?.jobGoal && (
                  <div>
                    <JobGoalBlock {...applicant.profile.jobGoal} />
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
      <LoginDialog
        isOpen={loginDialogOpen}
        close={() => setLoginDialogOpen(false)}
      />
    </div>
  );
};

export { PublicApplicantBasicInfo };
