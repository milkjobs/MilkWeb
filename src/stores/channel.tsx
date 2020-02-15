import {
  ChannelCustomType,
  SendbirdCredential,
  SendbirdCredentialFromJSON,
  SendbirdCredentialToJSON
} from "@frankyjuang/milkapi-client";
import { sendbirdConfig } from "config";
import "firebase/analytics";
import "firebase/auth";
import { LocalStorageItem } from "helpers";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
import SendBird from "sendbird";
import uuidv4 from "uuid/v4";
import { useAuth } from "./auth";

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

  const getSendbirdCredential = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      const rawCredential = window.localStorage.getItem(
        LocalStorageItem.SendbirdCredential
      );
      if (!rawCredential) {
        throw new Error();
      }

      const sendbirdCredential = SendbirdCredentialFromJSON(
        JSON.parse(rawCredential)
      );
      if (sendbirdCredential.expiresAt.getTime() < new Date().getTime()) {
        throw new Error();
      }

      setSendbirdCredential(sendbirdCredential);
    } catch (error) {
      setSendbirdCredential(undefined);
      const userApi = await getApi("User");
      const sendbirdCredential = await userApi.getSendbirdCredential({
        userId: user.uuid
      });
      setSendbirdCredential(sendbirdCredential);
    }
  }, [getApi, user]);

  const onMessageReceived: SendBird.ChannelHandler["onMessageReceived"] = useCallback(
    c => {
      // Update unread message count.
      sb?.getTotalUnreadMessageCount(count => {
        setUnreadMessageCount(count);
      });

      if (c.customType === ChannelCustomType.System) {
        reloadUser();
      }
    },
    [reloadUser, sb]
  );

  const addChannelHandler = useCallback(
    (handler: SendBird.ChannelHandler) => {
      if (sb) {
        const channelHandlerId = uuidv4();
        sb.addChannelHandler(channelHandlerId, handler);
        return channelHandlerId;
      }
    },
    [sb]
  );

  const removeChannelHandler = useCallback(
    (handlerId: string) => {
      sb?.removeChannelHandler(handlerId);
    },
    [sb]
  );

  useEffect(() => {
    user && getSendbirdCredential();
  }, [getSendbirdCredential, user]);

  useEffect(() => {
    if (user && sendbirdCredential) {
      const sb = new SendBird({ appId: sendbirdConfig.appId });
      sb.connect(user.uuid, sendbirdCredential.sessionToken, sbUser => {
        sbUser && setSb(sb);
      });
    }
  }, [sendbirdCredential, user]);

  useEffect(() => {
    if (sendbirdCredential) {
      const rawCredential = JSON.stringify(
        SendbirdCredentialToJSON(sendbirdCredential)
      );
      window.localStorage.setItem(
        LocalStorageItem.SendbirdCredential,
        rawCredential
      );
    }
  }, [sendbirdCredential]);

  useEffect(() => {
    if (sb) {
      // Set unread message count.
      sb.getTotalUnreadMessageCount(count => {
        setUnreadMessageCount(count);
      });
    }
  }, [sb]);

  useEffect(() => {
    if (sb) {
      // Register onMessageReceived listener.
      const newHandler = new sb.ChannelHandler();
      newHandler.onMessageReceived = onMessageReceived;
      const handlerId = addChannelHandler(newHandler);
      setChannelHandlerId(handlerId);
    }

    return () => {
      if (channelHandlerId) {
        removeChannelHandler(channelHandlerId);
        setChannelHandlerId(undefined);
      }
    };
  }, [
    addChannelHandler,
    channelHandlerId,
    onMessageReceived,
    removeChannelHandler,
    sb
  ]);

  return (
    <ChannelContext.Provider value={{ sb, unreadMessageCount }}>
      {children}
    </ChannelContext.Provider>
  );
};
