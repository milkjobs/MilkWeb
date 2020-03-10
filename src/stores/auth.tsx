import {
  AwesomeApi,
  ChannelApi,
  Configuration,
  EducationApi,
  ExperienceApi,
  JobApi,
  JobGoalApi,
  MembershipApi,
  MiscApi,
  OrderApi,
  ProfileApi,
  ProjectApi,
  RecruiterInfoApi,
  Role,
  SupportApi,
  TagApi,
  TeamApi,
  User,
  UserApi,
  VerificationApi
} from "@frankyjuang/milkapi-client";
import branch from "branch-sdk";
import { apiServiceConfig } from "config";
import "firebase/analytics";
import firebase from "firebase/app";
import "firebase/auth";
import { Apis, ExtractApi, LocalStorageItem, TypedApis } from "helpers";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";

interface AuthContextProps {
  getApi: <T extends keyof Apis>(type: T) => Promise<ExtractApi<TypedApis, T>>;
  loading: boolean;
  reloadUser: () => Promise<void>;
  user: User | null;
}

const AuthContext = createContext<AuthContextProps>({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getApi: () => undefined as any,
  loading: true,
  reloadUser: async () => {
    // Do nothing.
  },
  user: null
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const getApi: <T extends keyof Apis>(
    type: T
  ) => Promise<ExtractApi<TypedApis, T>> = useCallback(async type => {
    const firebaseUser = firebase.auth().currentUser;
    const accessToken = firebaseUser && (await firebaseUser.getIdToken());

    const configuration = new Configuration({
      accessToken: accessToken || undefined,
      ...apiServiceConfig
    });
    // Using any because typescript currently has design limitation to infer
    // return type while using extends keyof.
    // https://github.com/microsoft/TypeScript/issues/22735
    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (type === "Education") {
      return new EducationApi(configuration) as any;
    } else if (type === "Experience") {
      return new ExperienceApi(configuration) as any;
    } else if (type === "Job") {
      return new JobApi(configuration) as any;
    } else if (type === "JobGoal") {
      return new JobGoalApi(configuration) as any;
    } else if (type === "Misc") {
      return new MiscApi(configuration) as any;
    } else if (type === "Profile") {
      return new ProfileApi(configuration) as any;
    } else if (type === "Project") {
      return new ProjectApi(configuration) as any;
    } else if (type === "Team") {
      return new TeamApi(configuration) as any;
    } else if (type === "Membership") {
      return new MembershipApi(configuration) as any;
    } else if (type === "Order") {
      return new OrderApi(configuration) as any;
    } else if (type === "User") {
      return new UserApi(configuration) as any;
    } else if (type === "Verification") {
      return new VerificationApi(configuration) as any;
    } else if (type === "Channel") {
      return new ChannelApi(configuration) as any;
    } else if (type === "Awesome") {
      return new AwesomeApi(configuration) as any;
    } else if (type === "Support") {
      return new SupportApi(configuration) as any;
    } else if (type === "RecruiterInfo") {
      return new RecruiterInfoApi(configuration) as any;
    } else if (type === "Tag") {
      return new TagApi(configuration) as any;
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */

    throw new Error(`Unknown api type ${type}`);
  }, []);

  const reloadUser = useCallback(async () => {
    const firebaseUser = firebase.auth().currentUser;
    if (firebaseUser) {
      const userId = firebaseUser.uid;
      const userApi = await getApi("User");
      const [user, recruiter] = await Promise.all([
        userApi.getUser({ userId, role: Role.Applicant }),
        userApi.getUser({ userId, role: Role.Recruiter })
      ]);
      firebase.analytics().setUserId(userId);
      branch.setIdentity(userId);
      setUser({ ...user, recruiterInfo: recruiter.recruiterInfo });
    }
  }, [getApi]);

  const reset = useCallback(() => {
    for (const item in LocalStorageItem) {
      localStorage.removeItem(item);
    }
    firebase.analytics().setUserId("");
    branch.logout();
    setUser(null);
  }, []);

  useEffect(() => {
    firebase.auth().languageCode = "zh-TW";
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged(async firebaseUser => {
        if (firebaseUser) {
          firebase.analytics().logEvent("login", {});
          await reloadUser();
        } else {
          reset();
        }
        setLoading(false);
      });

    return unsubscribe;
  }, [reloadUser, reset]);

  return (
    <AuthContext.Provider
      value={{
        getApi,
        loading,
        reloadUser,
        user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
