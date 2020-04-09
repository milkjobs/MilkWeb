import { GroupChannel, OpenChannel, UserMessage } from "sendbird";
import { MessageCustomType } from "@frankyjuang/milkapi-client";

export type SendBirdMessage =
  | SendBird.UserMessage
  | SendBird.FileMessage
  | SendBird.AdminMessage;

export interface ResumeMetadata {
  resumeKey: string;
}

export interface ApplicationMetadata {
  jobId: string;
  applicantId: string;
}

export interface RequestMetadata {
  jobId: string;
  candidateId: string;
}

export const isGroupChannel = (
  ch: GroupChannel | OpenChannel
): ch is GroupChannel => (ch as GroupChannel).markAsRead !== undefined;

export const isUserMessage = (
  msg: SendBirdMessage
): msg is UserMessage | SendBird.FileMessage =>
  (msg as UserMessage | SendBird.FileMessage).sender !== undefined;

export const getMetadata = (m: SendBirdMessage) => {
  try {
    if (m.customType === MessageCustomType.Resume) {
      const metaData: ResumeMetadata = JSON.parse(m.data);
      if ("resumeKey" in metaData) {
        return metaData;
      }
    } else if (m.customType === MessageCustomType.Application) {
      const metaData: ApplicationMetadata = JSON.parse(m.data);
      if ("jobId" in metaData && "applicantId" in metaData) {
        return metaData;
      }
    } else if (m.customType === MessageCustomType.Request) {
      const metaData: RequestMetadata = JSON.parse(m.data);
      if ("jobId" in metaData && "candidateId" in metaData) {
        return metaData;
      }
    }
  } catch {
    // Do nothing.
  }
};

export const parseChannel = (channel: GroupChannel) => {
  const memberIds = channel.name.split("_");
  if (channel.members.length !== 2 || memberIds.length !== 2) {
    return [undefined, undefined];
  }

  const applicantUser = channel.members.find((m) => m.userId === memberIds[0]);
  const recruiterUser = channel.members.find((m) => m.userId === memberIds[1]);
  return [applicantUser, recruiterUser];
};
