import {
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
  Role,
  TeamApi,
  User,
  UserApi,
  VerificationApi,
  ChannelApi,
  AwesomeApi
} from "@frankyjuang/milkapi-client";
import { apiServiceConfig } from "config";
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import { Apis, ExtractApi, TypedApis } from "helpers/ApiService";
import { LocalStorageItem } from "helpers/types";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";

interface AuthContextProps {
  getApi: <T extends keyof Apis>(type: T) => Promise<ExtractApi<TypedApis, T>>;
  isAuthenticated: boolean;
  loading: boolean;
  reloadUser: () => Promise<void>;
  user: User | null;
  userId: string | null;
}

const AuthContext = createContext<AuthContextProps>({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getApi: () => undefined as any,
  isAuthenticated: false,
  loading: true,
  reloadUser: async () => {},
  user: null,
  userId: null
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

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
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */

    throw new Error(`Unknown api type ${type}`);
  }, []);

  const reloadUser = useCallback(async () => {
    const firebaseUser = firebase.auth().currentUser;
    if (firebaseUser) {
      const userId = firebaseUser.uid;
      const userApi = await getApi("User");
      const user = await userApi.getUser({ userId, role: Role.Applicant });
      const recruiter = await userApi.getUser({ userId, role: Role.Recruiter });
      firebase.analytics().setUserId(userId);
      setIsAuthenticated(true);
      setUserId(userId);
      setUser({ ...user, recruiterInfo: recruiter.recruiterInfo });
    }
  }, [getApi]);

  const reset = useCallback(() => {
    for (const item in LocalStorageItem) {
      localStorage.removeItem(item);
    }
    firebase.analytics().setUserId("");
    setIsAuthenticated(false);
    setUserId(null);
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
        isAuthenticated,
        loading,
        reloadUser,
        user,
        userId
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
