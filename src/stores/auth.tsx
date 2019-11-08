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
import { apiServiceConfig } from "config";
import { Auth0Service } from "helpers";
import { Apis, ExtractApi, TypedApis } from "helpers/ApiService";
import { LocalStorageItem } from "helpers/types";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface AuthContextProps {
  callback: () => Promise<void>;
  getApi: <T extends keyof Apis>(type: T) => Promise<ExtractApi<TypedApis, T>>;
  isAuthenticated: boolean;
  loading: boolean;
  login: ({
    phoneNumber,
    password
  }: {
    phoneNumber: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  reloadUser: () => Promise<void>;
  signup: ({
    name,
    phoneNumber,
    password,
    token
  }: {
    name: string;
    phoneNumber: string;
    password: string;
    token: string;
  }) => Promise<void>;
  user: User | null;
  userId: string | null;
}

export const AuthContext = createContext<AuthContextProps>({
  callback: async () => {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getApi: () => undefined as any,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  logout: () => {},
  reloadUser: async () => {},
  signup: async () => {},
  user: null,
  userId: null
});

export const useAuth = (): AuthContextProps => useContext(AuthContext);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const AuthProvider = ({ children }) => {
  const auth0Service = new Auth0Service();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const reset = () => {
    for (const item in LocalStorageItem) {
      localStorage.removeItem(item);
    }
    setIsAuthenticated(false);
    setAccessToken(null);
    setUserId(null);
    setUser(null);
  };

  const authenticate = async (accessToken: string) => {
    const userId = auth0Service.validateAccessToken(accessToken);
    if (!userId) {
      throw new Error("Invalid access token");
    }

    const userApi = new UserApi(
      new Configuration({ accessToken, ...apiServiceConfig })
    );
    const user = await userApi.getUser({ userId, role: Role.Applicant });
    const recruiter = await userApi.getUser({ userId, role: Role.Recruiter });
    localStorage.setItem(LocalStorageItem.AccessToken, accessToken);
    setIsAuthenticated(true);
    setAccessToken(accessToken);
    setUserId(userId);
    setUser({ ...user, recruiterInfo: recruiter.recruiterInfo });
  };

  const getApi = async <T extends keyof Apis>(
    type: T
  ): Promise<ExtractApi<TypedApis, T>> => {
    let currentAccessToken: string | undefined;
    if (accessToken) {
      currentAccessToken = accessToken;

      const userId = auth0Service.validateAccessToken(accessToken);
      if (!userId) {
        try {
          const newAccessToken = await auth0Service.renewAccessToken();
          await authenticate(newAccessToken);
          currentAccessToken = newAccessToken;
        } catch (error) {
          reset();
          currentAccessToken = undefined;
        }
      }
    }

    const configuration = new Configuration({
      accessToken: currentAccessToken,
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

  const signup = async ({
    name,
    phoneNumber,
    password,
    token
  }: {
    name: string;
    phoneNumber: string;
    password: string;
    token: string;
  }) => {
    await auth0Service.signup({
      name,
      username: phoneNumber,
      password,
      email: `${token}@milkjobs.ga`
    });
    await auth0Service.login({ username: phoneNumber, password });
  };

  const login = async ({
    phoneNumber,
    password
  }: {
    phoneNumber: string;
    password: string;
  }) => {
    // This redirects to auth0 login page and will come back to callback page.
    await auth0Service.login({ username: phoneNumber, password });
  };

  const callback = async () => {
    const accessToken = await auth0Service.parseUrlHash();
    await authenticate(accessToken);
  };

  const logout = () => {
    try {
      setLoading(true);
      auth0Service.logout();
      reset();
    } catch {
      setLoading(false);
    }
  };

  const reloadUser = async () => {
    if (userId) {
      const userApi = await getApi("User");
      const user = await userApi.getUser({ userId, role: Role.Applicant });
      const recruiter = await userApi.getUser({ userId, role: Role.Recruiter });
      setUser({ ...user, recruiterInfo: recruiter.recruiterInfo });
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      let accessToken = localStorage.getItem(LocalStorageItem.AccessToken);
      if (accessToken) {
        try {
          const userId = auth0Service.validateAccessToken(accessToken);
          if (!userId) {
            accessToken = await auth0Service.renewAccessToken();
          }
          await authenticate(accessToken);
        } catch (error) {
          reset();
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        callback,
        getApi: getApi,
        isAuthenticated,
        loading,
        login,
        logout,
        reloadUser,
        signup,
        user,
        userId
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
