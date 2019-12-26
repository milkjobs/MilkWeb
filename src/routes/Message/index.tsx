import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { makeStyles } from "@material-ui/core/styles";
import { uuid4 } from "@sentry/utils";
import { Header } from "components/Header";
import { MessageBox, MessageCard } from "components/Message";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import SendBird from "sendbird";
import { useAuth, useChannel } from "stores";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    backgroundColor: theme.palette.background.paper
  },
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
  },
  buttonGroup: {
    marginTop: 16,
    marginBottom: 16
  }
}));

const Message: React.FC = () => {
  const classes = useStyles();
  const { user } = useAuth();
  const { sb } = useChannel();
  const params = useParams<{ id: string }>();
  const history = useHistory();
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [, setChannelsQuery] = useState<SendBird.GroupChannelListQuery>();

  const channels = useRef<Array<SendBird.GroupChannel>>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<
    string | undefined
  >(params.id);
  const [, setState] = useState();

  useEffect(() => {
    setSelectedChannelId(undefined);
  }, [isRecruiter]);

  function onChannelChanged(channel) {
    const newGroupChannelList = channels.current.filter(
      c => c.name !== channel.name
    );
    channels.current = [channel, ...newGroupChannelList];
    setState({});
  }

  useEffect(() => {
    if (sb) {
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

  return (
    <div className={classes.root}>
      {isRecruiter ? <Header /> : <Header />}
      {channels.current.length > 0 && (
        <div className={classes.container}>
          <div className={classes.contacts}>
            {user && user.recruiterInfo && (
              <ButtonGroup
                className={classes.buttonGroup}
                color="primary"
                aria-label="small outlined button group"
              >
                <Button
                  onClick={() => setIsRecruiter(false)}
                  variant={isRecruiter ? undefined : "contained"}
                >
                  求職
                </Button>
                <Button
                  onClick={() => setIsRecruiter(true)}
                  variant={!isRecruiter ? undefined : "contained"}
                >
                  求才
                </Button>
              </ButtonGroup>
            )}
            {channelsFilter(channels.current).map((c, index) => {
              const applicantId = user ? user.uuid : "";
              const recruiter = c.members.filter(
                m => m.userId !== applicantId
              )[0];
              return (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedChannelId(c.url);
                    history.push(`/message/${c.url}`);
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
                isRecruiter={isRecruiter}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
