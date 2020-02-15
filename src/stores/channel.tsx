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
    ch => {
      // console.log(ch);
      sb?.getTotalUnreadMessageCount(count => {
        console.log("unreadddd", count);
        setUnreadMessageCount(count);
      });
      ch.customType === ChannelCustomType.System && reloadUser();
    },
    [reloadUser, sb]
  );

  const onTotalUnreadMessageCountUpdated: SendBird.UserEventHandler["onTotalUnreadMessageCountUpdated"] = useCallback(
    count => {
      console.log("unread", count);
      setUnreadMessageCount(+count);
    },
    []
  );

  const addUserHandler = useCallback(
    (handler: SendBird.UserEventHandler) => {
      if (sb) {
        const handlerId = uuidv4();
        console.log("adduserhandler", sb, handlerId);
        sb.addUserEventHandler(handlerId, handler);
        return handlerId;
      }
    },
    [sb]
  );

  const removeUserHandler = useCallback(
    (handlerId: string) => {
      sb?.removeUserEventHandler(handlerId);
    },
    [sb]
  );

  const addChannelHandler = useCallback(
    (handler: SendBird.ChannelHandler) => {
      if (sb) {
        const handlerId = uuidv4();
        sb.addChannelHandler(handlerId, handler);
        return handlerId;
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
    console.log("credential");
    user && getSendbirdCredential();
  }, [getSendbirdCredential, user]);

  useEffect(() => {
    console.log("connect");
    if (user && sendbirdCredential) {
      const sb = new SendBird({ appId: sendbirdConfig.appId });
      sb.connect(user.uuid, sendbirdCredential.sessionToken, sbUser => {
        sbUser && setSb(sb);
      });
    }
  }, [sendbirdCredential, user]);

  useEffect(() => {
    console.log("localstorage");
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

  // useEffect(() => {
  //   if (sb) {
  //     // Set unread message count.
  //     sb.getTotalUnreadMessageCount(count => {
  //       setUnreadMessageCount(count);
  //     });
  //   }
  // }, [sb]);

  useEffect(() => {
    console.log("userhandler");
    let handlerId: string | undefined;
    if (sb) {
      // Register onTotalUnreadMessageCountUpdated listener.
      const newHandler = new sb.UserEventHandler();
      newHandler.onTotalUnreadMessageCountUpdated = onTotalUnreadMessageCountUpdated;
      handlerId = addUserHandler(newHandler);
      console.log(handlerId);
    }

    return () => {
      handlerId && removeUserHandler(handlerId);
    };
  }, [addUserHandler, onTotalUnreadMessageCountUpdated, removeUserHandler, sb]);

  useEffect(() => {
    console.log("channelhandler");
    let handlerId: string | undefined;
    if (sb) {
      // Register onMessageReceived listener.
      const newHandler = new sb.ChannelHandler();
      newHandler.onMessageReceived = onMessageReceived;
      handlerId = addChannelHandler(newHandler);
    }

    return () => {
      handlerId && removeChannelHandler(handlerId);
    };
  }, [addChannelHandler, onMessageReceived, removeChannelHandler, sb]);

  return (
    <ChannelContext.Provider value={{ sb, unreadMessageCount }}>
      {children}
    </ChannelContext.Provider>
  );
};
