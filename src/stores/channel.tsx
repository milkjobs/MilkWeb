import { sendbirdConfig } from "config";
import "firebase/analytics";
import "firebase/auth";
import { LocalStorageItem } from "helpers";
import SendBird from "sendbird";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth";
import {
  SendbirdCredentialFromJSON,
  SendbirdCredential,
  SendbirdCredentialToJSON,
  ChannelCustomType
} from "@frankyjuang/milkapi-client";
import uuidv4 from "uuid/v4";

interface ChannelContextProps {
  unreadMessageCount?: number;
  sb?: SendBird.SendBirdInstance;
}

const ChannelContext = createContext<ChannelContextProps>({});

export const useChannel = () => useContext(ChannelContext);

export const ChannelProvider = ({ children }) => {
  const { user, getApi, reloadUser } = useAuth();
  const [sendbirdCredential, setSendbirdCredential] = useState<
    SendbirdCredential
  >();
  const [channelHandlerId, setChannelHandlerId] = useState<string>();
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [sb, setSb] = useState<SendBird.SendBirdInstance>();
  const getSendbirdCredential = async () => {
    if (user) {
      try {
        const sendbirdCredentialString = window.localStorage.getItem(
          LocalStorageItem.SendbirdCredential
        );
        if (sendbirdCredentialString === null) {
          throw new Error();
        }

        const sendbirdCredential = SendbirdCredentialFromJSON(
          JSON.parse(sendbirdCredentialString)
        );
        if (sendbirdCredential.expiresAt.getTime() < new Date().getTime()) {
          throw new Error();
        }

        setSendbirdCredential(sendbirdCredential);
      } catch (error) {
        const userApi = await getApi("User");
        const sendbirdCredential = await userApi.getSendbirdCredential({
          userId: user.uuid
        });
        setSendbirdCredential(sendbirdCredential);
        window.localStorage.setItem(
          LocalStorageItem.SendbirdCredential,
          JSON.stringify(SendbirdCredentialToJSON(sendbirdCredential))
        );
      }
    }
  };

  const onMessageReceived: SendBird.ChannelHandler["onMessageReceived"] = (
    c,
    m
  ) => {
    sb?.getTotalUnreadMessageCount((count, error) => {
      setUnreadMessageCount(count);
    });
    if (c.customType === ChannelCustomType.System) {
      reloadUser();
    }
  };

  const registerHandler = (handler: SendBird.ChannelHandler) => {
    const channelHandlerId = uuidv4();
    sb?.addChannelHandler(channelHandlerId, handler);
    return channelHandlerId;
  };
  const removeChannelHandler = (channelHandlerId: string) => {
    sb?.removeChannelHandler(channelHandlerId);
  };

  useEffect(() => {
    getSendbirdCredential();
    !user && channelHandlerId && removeChannelHandler(channelHandlerId);
  }, [user]);

  useEffect(() => {
    if (sb) {
      const newHandler = new sb.ChannelHandler();
      newHandler.onMessageReceived = onMessageReceived;
      setChannelHandlerId(registerHandler(newHandler));
      sb.getTotalUnreadMessageCount((count, error) => {
        setUnreadMessageCount(count);
      });
    }
  }, [sb]);

  useEffect(() => {
    if (user && sendbirdCredential) {
      const sb = new SendBird({ appId: sendbirdConfig.appId });
      sb.connect(user.uuid, sendbirdCredential.sessionToken, user => {
        user && setSb(sb);
      });
    } else window.localStorage.removeItem(LocalStorageItem.SendbirdCredential);
  }, [sendbirdCredential]);
  return (
    <ChannelContext.Provider value={{ sb, unreadMessageCount }}>
      {children}
    </ChannelContext.Provider>
  );
};
