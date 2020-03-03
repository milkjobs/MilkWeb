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

export const isUserMessage = (msg: SendBirdMessage): msg is UserMessage =>
  (msg as UserMessage).message !== undefined &&
  (msg as UserMessage).sender !== undefined;

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
