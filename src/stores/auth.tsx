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
  VerificationApi
} from "@frankyjuang/milkapi-client";
import to from "await-to-js";
import { apiServiceConfig } from "config";
import firebase from "firebase/app";
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

export interface AuthContextProps {
  getApi: <T extends keyof Apis>(type: T) => Promise<ExtractApi<TypedApis, T>>;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  reloadUser: () => Promise<void>;
  user: User | null;
  userId: string | null;
}

export const AuthContext = createContext<AuthContextProps>({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getApi: () => undefined as any,
  isAuthenticated: false,
  loading: true,
  logout: async () => {},
  reloadUser: async () => {},
  user: null,
  userId: null
});

export const useAuth = (): AuthContextProps => useContext(AuthContext);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const getApi = async <T extends keyof Apis>(
    type: T
  ): Promise<ExtractApi<TypedApis, T>> => {
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
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */

    throw new Error(`Unknown api type ${type}`);
  };

  const logout = async () => {
    setLoading(true);
    const [err] = await to(firebase.auth().signOut());
    if (!err) {
      for (const item in LocalStorageItem) {
        localStorage.removeItem(item);
      }
      setIsAuthenticated(false);
      setUserId(null);
      setUser(null);
    }
    setLoading(false);
  };

  const reloadUser = useCallback(async () => {
    const firebaseUser = firebase.auth().currentUser;
    if (firebaseUser) {
      const userId = firebaseUser.uid;
      const userApi = await getApi("User");
      const user = await userApi.getUser({ userId, role: Role.Applicant });
      const recruiter = await userApi.getUser({ userId, role: Role.Recruiter });
      setIsAuthenticated(true);
      setUserId(userId);
      setUser({ ...user, recruiterInfo: recruiter.recruiterInfo });
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      firebase.auth().languageCode = "zh-TW";
      const firebaseUser = firebase.auth().currentUser;
      if (firebaseUser) {
        await reloadUser();
      } else {
        // TODO: anonymous login.
      }
      setLoading(false);
    };
    init();
  }, [reloadUser]);

  return (
    <AuthContext.Provider
      value={{
        getApi: getApi,
        isAuthenticated,
        loading,
        logout,
        reloadUser,
        user,
        userId
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
