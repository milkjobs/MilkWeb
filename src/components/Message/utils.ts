import { GroupChannel, OpenChannel, UserMessage } from "sendbird";

export type SendBirdMessage =
  | SendBird.UserMessage
  | SendBird.FileMessage
  | SendBird.AdminMessage;

export const isGroupChannel = (
  ch: GroupChannel | OpenChannel
): ch is GroupChannel => (ch as GroupChannel).markAsRead !== undefined;

export const isUserMessage = (msg: SendBirdMessage): msg is UserMessage =>
  (msg as UserMessage).message !== undefined &&
  (msg as UserMessage).sender !== undefined;
