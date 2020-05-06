import {
  ChannelCustomType,
  SendbirdCredential,
  SendbirdCredentialFromJSON,
  SendbirdCredentialToJSON,
} from "@frankyjuang/milkapi-client";
import logo from "assets/milk.png";
import to from "await-to-js";
import {
  isGroupChannel,
  isUserMessage,
  parseChannel,
} from "components/Message/utils";
import { sendbirdConfig } from "config";
import "firebase/analytics";
import "firebase/auth";
import { LocalStorageItem } from "helpers";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import SendBird from "sendbird";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "./auth";
import { isMobile } from "react-device-detect";

interface ChannelContextProps {
  addChannelHandler: (handler: SendBird.ChannelHandler) => string | undefined;
  removeChannelHandler: (handlerId: string) => void;
  addUserEventHandler: (
    handler: SendBird.UserEventHandler
  ) => string | undefined;
  removeUserEventHandler: (handlerId: string) => void;
  sb?: SendBird.SendBirdInstance;
  unreadMessageCount: number;
}

const ChannelContext = createContext<ChannelContextProps>({
  addChannelHandler: () => "",
  removeChannelHandler: () => {
    // do nothing.
  },
  addUserEventHandler: () => "",
  removeUserEventHandler: () => {
    // do nothing.
  },
  unreadMessageCount: 0,
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

      const credential = SendbirdCredentialFromJSON(JSON.parse(rawCredential));
      if (credential.expiresAt.getTime() < new Date().getTime()) {
        throw new Error();
      }

      return credential;
    } catch (error) {
      window.localStorage.removeItem(LocalStorageItem.SendbirdCredential);

      const userApi = await getApi("User");
      const [, credential] = await to(
        userApi.getSendbirdCredential({
          userId: user.uuid,
        })
      );

      return credential;
    }
  }, [getApi, user]);

  const onMessageReceived: SendBird.ChannelHandler["onMessageReceived"] = useCallback(
    (ch, msg) => {
      if (
        !isGroupChannel(ch) ||
        !isUserMessage(msg) ||
        !user ||
        !("message" in msg)
      ) {
        return;
      }

      if (!isMobile && Notification.permission === "granted") {
        const [, recruiterMember] = parseChannel(ch);
        const href =
          user.uuid === recruiterMember?.userId
            ? `/recruiter/message/${ch.url}`
            : `/message/${ch.url}`;

        // Suppress notification if already at the channel page.
        if (window.location.pathname !== href) {
          const notification = new Notification(
            `牛奶找工作・${msg.sender.nickname}`,
            {
              badge: logo,
              body: msg.message,
              icon: msg.sender.profileUrl,
            }
          );
          notification.onclick = () => {
            window.location.href = href;
          };
        }
      }

      ch.customType === ChannelCustomType.System && reloadUser();
    },
    [reloadUser, user]
  );

  const onTotalUnreadMessageCountUpdated: SendBird.UserEventHandler["onTotalUnreadMessageCountUpdated"] = useCallback(
    (count) => {
      setUnreadMessageCount(+count);
    },
    []
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

  const addUserEventHandler = useCallback(
    (handler: SendBird.UserEventHandler) => {
      if (sb) {
        const handlerId = uuidv4();
        sb.addUserEventHandler(handlerId, handler);
        return handlerId;
      }
    },
    [sb]
  );

  const removeUserEventHandler = useCallback(
    (handlerId: string) => {
      sb?.removeUserEventHandler(handlerId);
    },
    [sb]
  );

  useEffect(() => {
    const loadCredential = async () => {
      if (user) {
        const credential = await getSendbirdCredential();
        setSendbirdCredential(credential);
      } else {
        setSendbirdCredential(undefined);
      }
    };

    loadCredential();
  }, [getSendbirdCredential, user]);

  useEffect(() => {
    const sb =
      SendBird.getInstance() || new SendBird({ appId: sendbirdConfig.appId });
    if (user && sendbirdCredential) {
      sb.connect(user.uuid, sendbirdCredential.sessionToken, (sbUser) => {
        sbUser && setSb(sb);
      });
    } else {
      sb.disconnect(() => setSb(undefined));
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
      sb.getTotalUnreadMessageCount((count) => {
        setUnreadMessageCount(count);
      });
    } else {
      setUnreadMessageCount(0);
    }
  }, [sb]);

  useEffect(() => {
    let handlerId: string | undefined;
    if (sb) {
      // Register onMessageReceived listener.
      const handler = new sb.ChannelHandler();
      handler.onMessageReceived = onMessageReceived;
      handlerId = addChannelHandler(handler);
    }

    return () => {
      handlerId && removeChannelHandler(handlerId);
    };
  }, [addChannelHandler, onMessageReceived, removeChannelHandler, sb]);

  useEffect(() => {
    let handlerId: string | undefined;
    if (sb) {
      // Register onTotalUnreadMessageCountUpdated listener.
      const handler = new sb.UserEventHandler();
      handler.onTotalUnreadMessageCountUpdated = onTotalUnreadMessageCountUpdated;
      handlerId = addUserEventHandler(handler);
    }

    return () => {
      handlerId && removeUserEventHandler(handlerId);
    };
  }, [
    addUserEventHandler,
    onTotalUnreadMessageCountUpdated,
    removeUserEventHandler,
    sb,
  ]);

  return (
    <ChannelContext.Provider
      value={{
        addChannelHandler,
        removeChannelHandler,
        addUserEventHandler,
        removeUserEventHandler,
        sb,
        unreadMessageCount,
      }}
    >
      {children}
    </ChannelContext.Provider>
  );
};
