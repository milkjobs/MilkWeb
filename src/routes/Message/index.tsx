import { makeStyles } from "@material-ui/core/styles";
import to from "await-to-js";
import { Header } from "components/Header";
import React, { useEffect, useRef, useState } from "react";
import { sendbirdConfig } from "config";
import SendBird from "sendbird";
import {
  SendbirdCredential,
  SendbirdCredentialToJSON,
  SendbirdCredentialFromJSON
} from "@frankyjuang/milkapi-client";
import { useAuth } from "stores";
import { uuid4 } from "@sentry/utils";
import { MessageCard, MessageBox } from "components/Message";

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
    flex: 1
  }
}));

const Message: React.FC = () => {
  const classes = useStyles();
  const { getApi, user } = useAuth();
  const [sendbirdCredential, setSendbirdCredential] = useState<
    SendbirdCredential
  >();
  const [sb, setSb] = useState<SendBird.SendBirdInstance>();
  const [channelsQuery, setChannelsQuery] = useState<
    SendBird.GroupChannelListQuery
  >();

  const channels = useRef<Array<SendBird.GroupChannel>>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<string>();
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
      const handler = new sb.ChannelHandler();
      handler.onChannelChanged = onChannelChanged;
      const channelHandlerId = uuid4();
      sb.addChannelHandler(channelHandlerId, handler);
    }
  }, [sb]);

  const getSendbirdCredential = async () => {
    if (user) {
      try {
        const sendbirdCredentialString = window.localStorage.getItem(
          "sendbirdCredential"
        );
        if (sendbirdCredentialString === null) throw "";

        const sendbirdCredential = SendbirdCredentialFromJSON(
          JSON.parse(sendbirdCredentialString)
        );
        if (sendbirdCredential.expiresAt.getTime() < new Date().getTime())
          throw "";
        setSendbirdCredential(sendbirdCredential);
      } catch (error) {
        const userApi = await getApi("User");
        const sendbirdCredential = await userApi.getSendbirdCredential({
          userId: user.uuid
        });
        setSendbirdCredential(sendbirdCredential);
        window.localStorage.setItem(
          "sendbirdCredential",
          JSON.stringify(SendbirdCredentialToJSON(sendbirdCredential))
        );
      }
    }
  };

  useEffect(() => {
    getSendbirdCredential();
  }, []);

  useEffect(() => {
    if (sendbirdCredential && user) {
      var sb = new SendBird({ appId: sendbirdConfig.appId });
      sb.connect(user.uuid, sendbirdCredential.sessionToken, (user, error) => {
        if (user) {
          setSb(sb);
          var channelListQuery = sb.GroupChannel.createMyGroupChannelListQuery();
          channelListQuery.includeEmpty = true;
          channelListQuery.order = "latest_last_message";
          channelListQuery.limit = 15;
          if (channelListQuery.hasNext) {
            channelListQuery.next(function(channelList, error) {
              if (error) {
                return;
              }
              setChannelsQuery(channelListQuery);
              channels.current = channelList.filter(
                c => c.members.length === 2
              );
              setState({});
            });
          }
        }
      });
    }
  }, [sendbirdCredential]);

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.container}>
        {channels.current.length === 0 ? (
          <div>還沒有詢問任何工作喔！</div>
        ) : (
          <>
            <div className={classes.contacts}>
              {channels.current.map((c, index) => {
                const applicantId = user ? user.uuid : "";
                const recruiter = c.members.filter(
                  m => m.userId !== applicantId
                )[0];
                return (
                  <div key={index} onClick={() => setSelectedChannelId(c.url)}>
                    <MessageCard
                      recruiter={recruiter}
                      teamName={""}
                      selected={c.url === selectedChannelId}
                      unreadMessageCount={
                        channels.current[index].unreadMessageCount
                      }
                      lastMessage={channels.current[index].lastMessage}
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
              {channels.current.filter(c => c.url === selectedChannelId)
                .length > 0 && (
                <MessageBox
                  channel={
                    channels.current.filter(c => c.url === selectedChannelId)[0]
                  }
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Message;
