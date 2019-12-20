import {
  EducationApi,
  ExperienceApi,
  JobApi,
  JobGoalApi,
  MembershipApi,
  MiscApi,
  OrderApi,
  ProfileApi,
  ProjectApi,
  TeamApi,
  UserApi,
  VerificationApi,
  ChannelApi
} from "@frankyjuang/milkapi-client";

// https://artsy.github.io/blog/2018/11/21/conditional-types-in-typescript/

type TagWithType<T> = { [K in keyof T]: { [_ in "type"]: K } & T[K] };
type Unionize<T> = T[keyof T];

export type Apis = {
  Education: EducationApi;
  Experience: ExperienceApi;
  Job: JobApi;
  JobGoal: JobGoalApi;
  Membership: MembershipApi;
  Misc: MiscApi;
  Order: OrderApi;
  Profile: ProfileApi;
  Project: ProjectApi;
  Team: TeamApi;
  User: UserApi;
  Verification: VerificationApi;
  Channel: ChannelApi;
};

export type TypedApis = Unionize<TagWithType<Apis>>;
export type ExtractApi<A, T> = Omit<Extract<A, { type: T }>, "type">;
