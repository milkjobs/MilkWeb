import { sendbirdConfig } from "config";
import "firebase/analytics";
import "firebase/auth";
import { LocalStorageItem } from "helpers/types";
import SendBird from "sendbird";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth";
import {
  SendbirdCredentialFromJSON,
  SendbirdCredential,
  SendbirdCredentialToJSON
} from "@frankyjuang/milkapi-client";

interface ChannelContextProps {
  sb?: SendBird.SendBirdInstance;
}

const ChannelContext = createContext<ChannelContextProps>({});

export const useChannel = () => useContext(ChannelContext);

export const ChannelProvider = ({ children }) => {
  const { user, getApi } = useAuth();
  const [sendbirdCredential, setSendbirdCredential] = useState<
    SendbirdCredential
  >();
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

  useEffect(() => {
    getSendbirdCredential();
  }, [user]);
  useEffect(() => {
    if (user && sendbirdCredential) {
      const sb = new SendBird({ appId: sendbirdConfig.appId });
      sb.connect(user.uuid, sendbirdCredential.sessionToken, user => {
        user && setSb(sb);
      });
    } else window.localStorage.removeItem(LocalStorageItem.SendbirdCredential);
  }, [sendbirdCredential]);
  return (
    <ChannelContext.Provider value={{ sb }}>{children}</ChannelContext.Provider>
  );
};
