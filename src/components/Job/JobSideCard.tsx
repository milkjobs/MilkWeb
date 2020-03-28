import { Job } from "@frankyjuang/milkapi-client";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import { LoginDialog } from "components/Util";
import React, { useState, useEffect } from "react";
import Sticky from "react-stickynode";
import {
  Configure,
  InstantSearch,
  connectSearchBox
} from "react-instantsearch-dom";
import { useSearch } from "stores";
import { algoliaConfig } from "config";
import {
  InfiniteHitsProvided,
  SearchBoxProvided
} from "react-instantsearch-core";
import { connectInfiniteHits } from "react-instantsearch-dom";
import { Link } from "react-router-dom";
import { salaryToString } from "helpers";

const useStyles = makeStyles(theme => ({
  card: {
    display: "flex",
    flexDirection: "column",
    border: "1px solid #C8C8C8",
    paddingTop: 16,
    paddingBottom: 16,
    paddingRight: 24,
    paddingLeft: 24,
    borderRadius: 4
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    width: "100%",
    marginTop: 8,
    color: theme.palette.common.white,
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius: 4,
    boxShadow: "none"
  },
  contact: {
    textAlign: "left",
    marginTop: 12
  },
  review: {
    marginTop: 4,
    display: "flex",
    fontSize: 14,
    fontWeight: 400,
    color: "#484848"
  },
  recruiterContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: 12
  },
  recruiterName: {
    display: "flex",
    alignItems: "center",
    fontSize: 18,
    fontWeight: 800,
    color: theme.palette.text.primary
  },
  recruiterTitle: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    fontWeight: 400,
    color: theme.palette.text.secondary
  },
  similarJobsContainer: {
    marginTop: 100,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    width: "100%"
  },
  similarJobsTitle: {
    fontSize: 18
  },
  similarJobCard: {
    textDecoration: "none",
    display: "flex",
    flexDirection: "column",
    paddingTop: 8,
    paddingBottom: 8,
    "&:hover": {
      cursor: "pointer"
    }
  },
  similarJobTitle: {
    display: "flex",
    marginBottom: 16
  },
  nameContainer: {
    display: "flex",
    flex: 1,
    alignItems: "center"
  },
  jobName: {
    display: "flex",
    maxWidth: 200,
    color: theme.palette.text.primary,
    fontSize: 16,
    fontWeight: 800,
    marginRight: 16,
    overflow: "hidden",
    [theme.breakpoints.down("xs")]: {
      fontSize: 16
    }
  },
  jobSalary: {
    minWidth: 100,
    fontSize: 16,
    fontWeight: 400,
    textAlign: "left",
    color: theme.palette.secondary.main
  },
  truncate: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  teamName: {
    display: "flex",
    color: theme.palette.text.hint,
    fontSize: 16,
    overflow: "hidden",
    [theme.breakpoints.down("xs")]: {
      fontSize: 16
    }
  }
}));

const JobList: React.FC<InfiniteHitsProvided> = props => {
  const classes = useStyles();
  const { hits } = props;

  return (
    <>
      {hits.slice(1).map((value, index) => (
        <Link
          key={index}
          to={`/job/${value.objectID}`}
          className={classes.similarJobCard}
        >
          <div className={classes.nameContainer}>
            <div className={classes.jobName}>
              <div className={classes.truncate}>{value.name}</div>
            </div>
            <div className={classes.jobSalary}>
              {salaryToString(
                value.minSalary,
                value.maxSalary,
                value.salaryType
              )}
            </div>
          </div>
          <div className={classes.teamName}>{value.team.nickname}</div>
        </Link>
      ))}
    </>
  );
};

const ConnectedJobList = connectInfiniteHits(JobList);

const SearchBar: React.FC<SearchBoxProvided> = props => {
  return <div></div>;
};
const ConnectedSearchBar = connectSearchBox(SearchBar);

interface Props {
  job: Job;
}

const JobSideCard: React.FC<Props> = ({ job }) => {
  const { uuid: jobId, recruiter, team, name } = job;
  const classes = useStyles();
  const { searchClient, loadAlgoliaCredential } = useSearch();
  useEffect(() => {
    console.warn(searchClient);
    !searchClient && loadAlgoliaCredential();
  }, [searchClient]);
  // const history = useHistory();
  // const { user, getApi } = useAuth();
  // const { sb } = useChannel();
  // const [loading, setLoading] = useState(false);
  // const [channel, setChannel] = useState<SendBird.GroupChannel>();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  // const createChannel = async (
  //   members: string[],
  //   data: Record<string, any>
  // ): Promise<SendBird.GroupChannel> => {
  //   return new Promise((resolve, reject) => {
  //     const sb = SendBird.getInstance();
  //     sb.GroupChannel.createChannelWithUserIds(
  //       members,
  //       false,
  //       members.join("_"),
  //       "",
  //       JSON.stringify(data),
  //       (channel, error) => {
  //         error ? reject(error) : resolve(channel);
  //       }
  //     );
  //   });
  // };

  // const sendApplicationMessage = async (
  //   channel: SendBird.GroupChannel,
  //   newApplication: ApplicationMetaData
  // ): Promise<
  //   SendBird.UserMessage | SendBird.FileMessage | SendBird.AdminMessage
  // > => {
  //   const sb = SendBird.getInstance();
  //   const params = new sb.UserMessageParams();
  //   params.customType = MessageCustomType.Application;
  //   params.message = "職缺詢問";
  //   params.data = JSON.stringify(newApplication);
  //   return new Promise((resolve, reject) => {
  //     channel.sendUserMessage(params, (message, error) => {
  //       error ? reject(error) : resolve(message);
  //     });
  //   });
  // };

  // const apply = async () => {
  //   if (user && recruiter && sb) {
  //     const members = [user.uuid, recruiter.uuid];
  //     // Check there is an application or not
  //     const filteredQuery = sb.GroupChannel.createMyGroupChannelListQuery();
  //     filteredQuery.userIdsIncludeFilter = members;
  //     filteredQuery.next(async groupChannels => {
  //       let applicationChannel = groupChannels.find(
  //         c =>
  //           c.name === members.join("_") &&
  //           c.members.some(m => m.userId === user.uuid) &&
  //           c.members.some(m => m.userId === recruiter.uuid)
  //       );
  //       let newMetadata = {};
  //       // If not found, create a new channel.
  //       if (!applicationChannel) {
  //         applicationChannel = await createChannel(members, {
  //           teamName: team ? team.nickname : ""
  //         });
  //         newMetadata = {
  //           applicantId: user.uuid,
  //           recruiterId: recruiter.uuid,
  //           teamName: team && team.nickname,
  //           teamId: team && team.uuid
  //         };
  //       }

  //       // Add application
  //       const channelApi = await getApi("Channel");
  //       channelApi.addApplication({
  //         newApplication: {
  //           applicantUserId: user.uuid,
  //           channelUrl: applicationChannel.url,
  //           jobId
  //         }
  //       });

  //       // Update jobs meta data
  //       newMetadata[jobId] = "job";
  //       applicationChannel.updateMetaData(newMetadata, true, () => {
  //         // Do nothing.
  //       });

  //       await to(
  //         sendApplicationMessage(applicationChannel, {
  //           jobId,
  //           applicantId: user.uuid
  //         })
  //       );

  //       history.push("/message/" + applicationChannel.url);
  //     });
  //   }
  // };

  // useEffect(() => {
  //   if (user && recruiter && sb) {
  //     setLoading(true);
  //     const recruiterId = recruiter.uuid;
  //     const members = [user.uuid, recruiterId];
  //     // Check there is an application or not
  //     const filteredQuery = sb.GroupChannel.createMyGroupChannelListQuery();
  //     filteredQuery.userIdsIncludeFilter = members;
  //     filteredQuery.next(groupChannels => {
  //       const applicationChannel = groupChannels.find(
  //         c =>
  //           c.name === members.join("_") &&
  //           c.members.some(m => m.userId === user.uuid) &&
  //           c.members.some(m => m.userId === recruiterId)
  //       );
  //       if (applicationChannel) {
  //         applicationChannel.getMetaData([jobId], res => {
  //           try {
  //             res[jobId] === "job" && setChannel(applicationChannel);
  //           } catch (err) {
  //             return;
  //           }
  //           setLoading(false);
  //         });
  //       } else setLoading(false);
  //     });
  //   }
  // }, [user, sb, recruiter, jobId]);

  // const chat = async () => {
  //   if (!user) {
  //     setIsLoginDialogOpen(true);
  //   } else if (channel) {
  //     history.push("/message/" + channel.url);
  //   } else {
  //     apply();
  //   }
  // };

  return (
    <div>
      <div style={{ height: "32px" }}></div>
      <LoginDialog
        isOpen={isLoginDialogOpen}
        close={() => setIsLoginDialogOpen(false)}
      />
      <Sticky top={32}>
        <div className={classes.card}>
          {recruiter && (
            <div className={classes.recruiterContainer}>
              <Avatar
                alt="recruiter profile image"
                src={recruiter.profileImageUrl}
                style={{ width: 30, height: 30, marginRight: 16 }}
              />
              <div>
                <div className={classes.recruiterName}>{recruiter.name}</div>
                <div className={classes.recruiterTitle}>
                  {recruiter.title || "招募員"}
                </div>
              </div>
            </div>
          )}
          {job.contact && (
            <div className={classes.contact}>聯絡方式・{job.contact}</div>
          )}
          {/* {!loading && recruiter.uuid !== user?.uuid && (
            <Button className={classes.button} onClick={chat}>
              {channel ? "繼續詢問" : "詢問"}
            </Button>
          )} */}
        </div>
        {searchClient && (
          <div className={classes.similarJobsContainer}>
            <div className={classes.similarJobsTitle}>{"類似職缺"}</div>
            <InstantSearch
              indexName={algoliaConfig.index}
              searchClient={searchClient}
            >
              <ConnectedSearchBar defaultRefinement={name} />
              <Configure hitsPerPage={6} optionalWords={[name]} />
              <ConnectedJobList />
            </InstantSearch>
          </div>
        )}
      </Sticky>
    </div>
  );
};

export { JobSideCard };
