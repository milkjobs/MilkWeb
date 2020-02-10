import { makeStyles } from "@material-ui/core/styles";
import { uuid4 } from "@sentry/utils";
import { MessageBox, MessageCard } from "components/Message";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import SendBird from "sendbird";
import { useAuth, useChannel } from "stores";

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    flex: 1,
    flexDirection: "row",
    width: "100%"
  },
  title: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    color: theme.palette.text.primary,
    fontSize: 24,
    fontWeight: 400,
    [theme.breakpoints.down("xs")]: {
      fontSize: 18
    }
  },
  contacts: {
    border: "1px solid #EBEBEB",
    flex: 1,
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  }
}));

interface Props {
  isRecruiter?: boolean;
}

const ChatRoom: React.FC<Props> = ({ isRecruiter }) => {
  const classes = useStyles();
  const { user } = useAuth();
  const { sb } = useChannel();
  const params = useParams<{ id: string }>();
  const history = useHistory();
  const [, setChannelsQuery] = useState<SendBird.GroupChannelListQuery>();

  const channels = useRef<Array<SendBird.GroupChannel>>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<
    string | undefined
  >(params.id);
  const [, setState] = useState();

  function onChannelChanged(channel) {
    const newGroupChannelList = channels.current.filter(
      c => c.name !== channel.name
    );
    channels.current = [channel, ...newGroupChannelList];
    setState({});
  }

  useEffect(() => {
    if (sb) {
      setSelectedChannelId(params.id);
      const handler = new sb.ChannelHandler();
      handler.onChannelChanged = onChannelChanged;
      const channelHandlerId = uuid4();
      sb.addChannelHandler(channelHandlerId, handler);
    }
  }, [sb]);

  useEffect(() => {
    if (sb) {
      const channelListQuery = sb.GroupChannel.createMyGroupChannelListQuery();
      channelListQuery.includeEmpty = true;
      channelListQuery.order = "latest_last_message";
      channelListQuery.limit = 15;
      if (channelListQuery.hasNext) {
        channelListQuery.next(function(channelList, error) {
          if (error) {
            return;
          }
          setChannelsQuery(channelListQuery);
          channels.current = channelList.filter(c => c.members.length === 2);
          setState({});
        });
      }
    }
  }, [sb]);

  const parseChannel = (channel: SendBird.GroupChannel) => {
    const memberIds = channel.name.split("_");
    if (memberIds.length !== 2) return [undefined, undefined];
    const applicantUser = channel.members.find(m => m.userId === memberIds[0]);
    const recruiterUser = channel.members.find(m => m.userId === memberIds[1]);
    if (channel.members.length === 2 && applicantUser && recruiterUser)
      return [applicantUser, recruiterUser];
    return [undefined, undefined];
  };

  const channelsFilter = (
    sendBirdChannels: Array<SendBird.GroupChannel>
  ): Array<SendBird.GroupChannel> => {
    return sendBirdChannels.reduce<Array<SendBird.GroupChannel>>(
      (result, c) => {
        let matchChannel: SendBird.GroupChannel | undefined;
        const [applicantUser, recruiterUser] = parseChannel(c);
        // Check channel is system channel or not
        if (user && c.url === user.systemChannelUrl) {
          matchChannel = c;
        } else if (
          user &&
          applicantUser &&
          user.uuid === applicantUser.userId &&
          !isRecruiter
        ) {
          // Filter Applicant Channels
          matchChannel = c;
        } else if (
          user &&
          recruiterUser &&
          user.uuid === recruiterUser.userId &&
          isRecruiter
        ) {
          // Filter Applicant Channels
          matchChannel = c;
        }
        matchChannel && result.push(matchChannel);
        return result;
      },
      []
    );
  };

  return channels.current.length === 0 ? null : (
    <div className={classes.container}>
      <div className={classes.contacts}>
        {channelsFilter(channels.current).map((c, index) => {
          const applicantId = user ? user.uuid : "";
          const recruiter = c.members.filter(m => m.userId !== applicantId)[0];
          return (
            <div
              key={index}
              onClick={() => {
                setSelectedChannelId(c.url);
                if (isRecruiter) {
                  history.push(`/recruiter/message/${c.url}`);
                } else {
                  history.push(`/message/${c.url}`);
                }
              }}
            >
              <MessageCard
                recruiter={recruiter}
                teamName={""}
                selected={c.url === selectedChannelId}
                unreadMessageCount={
                  channelsFilter(channels.current)[index].unreadMessageCount
                }
                lastMessage={
                  channelsFilter(channels.current)[index].lastMessage
                }
              />
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          flex: 3,
          position: "relative"
        }}
      >
        {channels.current.filter(c => c.url === selectedChannelId).length >
          0 && (
          <MessageBox
            channel={
              channels.current.filter(c => c.url === selectedChannelId)[0]
            }
            isRecruiter={!!isRecruiter}
          />
        )}
      </div>
    </div>
  );
};

export { ChatRoom };
