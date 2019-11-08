import {
  EducationLevel,
  ExperienceLevel,
  Job,
  JobType,
  SalaryType,
  Team,
  TeamSize,
  User,
  VerificationState
} from "@frankyjuang/milkapi-client";

export enum LocalStorageItem {
  AlgoliaCredential = "AlgoliaCredential"
}

export enum MobileOS {
  WindowsPhone,
  Android,
  Ios
}

export const InitialTeam: Team = {
  uuid: "",
  unifiedNumber: "",
  name: "",
  size: TeamSize.Large,
  logoUrl: "",
  primaryField: "",
  secondaryField: "",
  address: { area: "1", subArea: "1", street: "1" },
  website: "",
  introduction: "",
  nickname: "",
  jobs: [],
  certificateVerified: VerificationState.None
};

export const InitialUser: User = {
  uuid: "",
  name: "",
  username: "",
  createdAt: new Date(),
  profileImageUrl: "",
  idCardVerified: VerificationState.None,
  systemChannelUrl: ""
};

export const InitialJob: Job = {
  uuid: "",
  lastUpdatedAt: new Date(),
  name: "",
  type: JobType.Fulltime,
  minSalary: 100,
  maxSalary: 300,
  salaryType: SalaryType.Hourly,
  address: { area: "", subArea: "", street: "" },
  description: "",
  experienceNeed: ExperienceLevel.Any,
  educationNeed: EducationLevel.Any,
  createdAt: new Date(),
  skillTags: [],
  totalViews: 0,
  totalVisitors: 0,
  totalChannels: 0,
  published: true
};
