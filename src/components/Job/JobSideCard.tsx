import {
  PublicUser,
  Team,
  MessageCustomType
} from "@frankyjuang/milkapi-client";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import Sticky from "react-stickynode";
import { useChannel } from "stores/channel";
import { useAuth } from "stores";
import SendBird from "sendbird";
import to from "await-to-js";
import { ApplicationMetaData } from "helpers";
import { useHistory } from "react-router-dom";
import { LoginDialog } from "components/Util";

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
  }
}));

interface Props {
  jobId: string;
  recruiter: PublicUser;
  team?: Team;
}

const JobSideCard: React.FC<Props> = props => {
  const { recruiter, jobId, team } = props;
  const classes = useStyles();
  const history = useHistory();
  const { user, getApi } = useAuth();
  const { sb } = useChannel();
  const [loading, setLoading] = useState(false);
  const [channel, setChannel] = useState<SendBird.GroupChannel>();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const showLoginDialog = () => {
    setIsLoginDialogOpen(true);
  };

  const hideLoginDialog = () => {
    setIsLoginDialogOpen(false);
  };

  const createChannel = async (
    members: string[],
    data: Record<string, any>
  ): Promise<SendBird.GroupChannel> => {
    return new Promise((resolve, reject) => {
      const sb = SendBird.getInstance();
      sb.GroupChannel.createChannelWithUserIds(
        members,
        false,
        members.join("_"),
        "",
        JSON.stringify(data),
        (channel, error) => {
          error ? reject(error) : resolve(channel);
        }
      );
    });
  };

  const sendApplicationMessage = async (
    channel: SendBird.GroupChannel,
    newApplication: ApplicationMetaData
  ): Promise<
    SendBird.UserMessage | SendBird.FileMessage | SendBird.AdminMessage
  > => {
    const sb = SendBird.getInstance();
    const params = new sb.UserMessageParams();
    params.customType = MessageCustomType.Application;
    params.message = "職缺詢問";
    params.data = JSON.stringify(newApplication);
    return new Promise((resolve, reject) => {
      channel.sendUserMessage(params, (message, error) => {
        error ? reject(error) : resolve(message);
      });
    });
  };

  const apply = async () => {
    if (user && recruiter && sb) {
      const members = [user.uuid, recruiter.uuid];
      // Check there is an application or not
      const filteredQuery = sb.GroupChannel.createMyGroupChannelListQuery();
      filteredQuery.userIdsIncludeFilter = members;
      filteredQuery.next(async groupChannels => {
        let applicationChannel = groupChannels.find(
          c =>
            c.name === members.join("_") &&
            c.members.some(m => m.userId === user.uuid) &&
            c.members.some(m => m.userId === recruiter.uuid)
        );
        let newMetadata = {};
        // If not found, create a new channel.
        if (!applicationChannel) {
          applicationChannel = await createChannel(members, {
            teamName: team ? team.nickname : ""
          });
          newMetadata = {
            applicantId: user.uuid,
            recruiterId: recruiter.uuid,
            teamName: team && team.nickname,
            teamId: team && team.uuid
          };
        }

        // Add application
        const channelApi = await getApi("Channel");
        channelApi.addApplication({
          newApplication: {
            applicantUserId: user.uuid,
            channelUrl: applicationChannel.url,
            jobId
          }
        });

        // Update jobs meta data
        newMetadata[jobId] = "job";
        applicationChannel.updateMetaData(newMetadata, true, () => {});

        await to(
          sendApplicationMessage(applicationChannel, {
            jobId,
            applicantId: user.uuid
          })
        );

        history.push("/message/" + applicationChannel.url);
      });
    }
  };

  useEffect(() => {
    if (user && sb) {
      setLoading(true);
      const recruiterId = recruiter.uuid;
      const members = [user.uuid, recruiterId];
      // Check there is an application or not
      const filteredQuery = sb.GroupChannel.createMyGroupChannelListQuery();
      filteredQuery.userIdsIncludeFilter = members;
      filteredQuery.next(groupChannels => {
        const applicationChannel = groupChannels.find(
          c =>
            c.name === members.join("_") &&
            c.members.some(m => m.userId === user.uuid) &&
            c.members.some(m => m.userId === recruiterId)
        );
        if (applicationChannel) {
          applicationChannel.getMetaData([jobId], res => {
            try {
              res[jobId] === "job" && setChannel(applicationChannel);
            } catch (err) {
              return;
            }
            setLoading(false);
          });
        } else setLoading(false);
      });
    }
  }, [user, sb, recruiter.uuid, jobId]);

  const chat = async () => {
    if (!user) {
      showLoginDialog();
    } else if (channel) {
      history.push("/message/" + channel.url);
    } else {
      apply();
    }
  };

  return (
    <div>
      <div style={{ height: "32px" }}></div>
      <LoginDialog isOpen={isLoginDialogOpen} close={hideLoginDialog} />
      <Sticky top={32}>
        <div className={classes.card}>
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
          {!loading && recruiter.uuid !== user?.uuid && (
            <Button className={classes.button} onClick={chat}>
              {channel ? "繼續詢問" : "詢問"}
            </Button>
          )}
        </div>
      </Sticky>
    </div>
  );
};

export { JobSideCard };
