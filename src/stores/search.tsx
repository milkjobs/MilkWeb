import {
  AlgoliaCredential,
  AlgoliaCredentialFromJSON,
  AlgoliaCredentialToJSON,
} from "@frankyjuang/milkapi-client";
import algoliasearch, { SearchClient } from "algoliasearch";
import to from "await-to-js";
import { algoliaConfig } from "config";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./auth";

interface SearchContextProps {
  indexName: string;
  loadAlgoliaCredential: () => Promise<void>;
  jobRecommend: boolean;
  setJobRecommend: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
  searchClient?: SearchClient;
  searchState: any;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchState: (...args: any[]) => any;
}

const sleep = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

const SearchContext = createContext<SearchContextProps>({
  indexName: "",
  loadAlgoliaCredential: async () => {},
  jobRecommend: true,
  setJobRecommend: () => {},
  refresh: false,
  searchClient: undefined,
  searchState: {},
  setRefresh: () => {},
  setSearchState: () => {},
});

export const SearchProvider = ({ children }: any) => {
  const { getApi, user } = useAuth();
  const [refresh, setRefresh] = useState(false);
  const [jobRecommend, setJobRecommend] = useState(true);
  const [searchClient, setSearchClient] = useState<SearchClient>();
  const [searchState, setSearchState] = useState({});
  const [algoliaCredential, setAlgoliaCredential] = useState<
    AlgoliaCredential
  >();

  const isValidCredential = (credential: AlgoliaCredential | undefined) => {
    return credential ? credential.expiresAt.getTime() > Date.now() : false;
  };

  const refreshAlgoliaCredential = useCallback(async () => {
    let credential: AlgoliaCredential | undefined;
    let err;
    let retry = 3;

    while (retry > 0) {
      if (user) {
        const userApi = await getApi("User");
        [err, credential] = await to(
          userApi.getAlgoliaCredential({ userId: user.uuid })
        );
      } else {
        const miscApi = await getApi("Misc");
        [err, credential] = await to(miscApi.getAnonymousAlgoliaCredential());
      }

      if (credential) {
        return credential;
      }
      await sleep(1000);
      retry -= 1;
    }

    throw err;
  }, [user, getApi]);

  const loadAlgoliaCredential = useCallback(async () => {
    if (isValidCredential(algoliaCredential)) {
      return;
    }

    // Try loading credential from async storage.
    try {
      const rawCredential = await localStorage.getItem("AlgoliaCredential");

      if (!rawCredential) {
        throw new Error("No asyncstorage credential found");
      }

      const credential = AlgoliaCredentialFromJSON(JSON.parse(rawCredential));
      if (!isValidCredential(credential)) {
        throw new Error("Invalid credential");
      }

      setAlgoliaCredential(credential);
      return;
    } catch {
      // Remove broken credential.
      localStorage.removeItem("AlgoliaCredential");
    }

    const credential = await refreshAlgoliaCredential();
    setAlgoliaCredential(credential);
  }, [algoliaCredential, refreshAlgoliaCredential]);

  useEffect(() => {
    refresh &&
      setTimeout(() => {
        setRefresh(false);
      }, 500);
  }, [refresh]);

  useEffect(() => {
    if (algoliaCredential && isValidCredential(algoliaCredential)) {
      const rawCredential = JSON.stringify(
        AlgoliaCredentialToJSON(algoliaCredential)
      );
      localStorage.setItem("AlgoliaCredential", rawCredential);
    }
  }, [algoliaCredential]);

  useEffect(() => {
    if (algoliaCredential && isValidCredential(algoliaCredential)) {
      const client = algoliasearch(
        algoliaConfig.appId,
        algoliaCredential.apiKey
      );
      setSearchClient(client);
    }
  }, [algoliaCredential]);

  return (
    <SearchContext.Provider
      value={{
        indexName: algoliaConfig.index,
        loadAlgoliaCredential,
        jobRecommend,
        setJobRecommend,
        refresh,
        searchClient,
        searchState,
        setRefresh,
        setSearchState,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
