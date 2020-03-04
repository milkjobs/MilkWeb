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
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "./auth";

interface ChannelContextProps {
  addChannelHandler: (handler: SendBird.ChannelHandler) => string | undefined;
  removeChannelHandler: (handlerId: string) => void;
  sb?: SendBird.SendBirdInstance;
  unreadMessageCount: number;
}

const ChannelContext = createContext<ChannelContextProps>({
  addChannelHandler: () => "",
  removeChannelHandler: () => {
    // do nothing.
  },
  unreadMessageCount: 0
});

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
      sb?.getTotalUnreadMessageCount(count => {
        setUnreadMessageCount(count);
      });
      ch.customType === ChannelCustomType.System && reloadUser();
    },
    [reloadUser, sb]
  );

  const onTotalUnreadMessageCountUpdated: SendBird.UserEventHandler["onTotalUnreadMessageCountUpdated"] = useCallback(
    count => {
      setUnreadMessageCount(+count);
    },
    []
  );

  const addUserHandler = useCallback(
    (handler: SendBird.UserEventHandler) => {
      if (sb) {
        const handlerId = uuidv4();
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
      // Set initial unread message count.
      sb.getTotalUnreadMessageCount(count => {
        setUnreadMessageCount(count);
      });
    }
  }, [sb]);

  useEffect(() => {
    let handlerId: string | undefined;
    if (sb) {
      // Register onTotalUnreadMessageCountUpdated listener.
      const newHandler = new sb.UserEventHandler();
      newHandler.onTotalUnreadMessageCountUpdated = onTotalUnreadMessageCountUpdated;
      handlerId = addUserHandler(newHandler);
    }

    return () => {
      handlerId && removeUserHandler(handlerId);
    };
  }, [addUserHandler, onTotalUnreadMessageCountUpdated, removeUserHandler, sb]);

  useEffect(() => {
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
    <ChannelContext.Provider
      value={{
        addChannelHandler,
        removeChannelHandler,
        sb,
        unreadMessageCount
      }}
    >
      {children}
    </ChannelContext.Provider>
  );
};
