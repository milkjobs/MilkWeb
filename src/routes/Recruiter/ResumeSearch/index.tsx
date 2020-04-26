import { UserApi, SalaryType } from "@frankyjuang/milkapi-client";
import { IconButton, InputBase, makeStyles } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import algoliasearch, { SearchClient } from "algoliasearch/lite";
import { Header } from "components/Header";
import { ApplicantList, ApplicantSearchBar } from "components/ApplicantSearch";
import { SearchResult } from "components/JobSearch/SearchResult";
import { algoliaApplicantConfig } from "config";
import "firebase/analytics";
import { AlgoliaService, SitelinksSearchboxStructuredData } from "helpers";
import React, { useEffect, useState } from "react";
import { Configure, InstantSearch } from "react-instantsearch-dom";
import { useInView } from "react-intersection-observer";
import { useLocation } from "react-router-dom";
import { useAuth } from "stores";
import { useSearch } from "stores";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper,
  },
  container: {
    marginTop: 40,
    marginBottom: 40,
    display: "flex",
    justifyContent: "center",
    marginRight: "auto",
    marginLeft: "auto",
    paddingRight: 24,
    paddingLeft: 24,
    flexDirection: "column",
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up("md")]: {
      width: "960px",
    },
    [theme.breakpoints.down("xs")]: {
      marginTop: 8,
      marginBottom: 8,
    },
  },
  searchBarRoot: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    flex: 1,
    marginBottom: 36,
    border: "1px solid #dfe1e5",
    borderRadius: 10,
    "&:hover": {
      boxShadow: "0 2px 4px rgba(0,0,0,0.1) !important",
    },
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  latestJobs: {
    width: 200,
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
    height: 20,
  },
  latestNews: {
    width: 200,
    textAlign: "center",
    fontWeight: 800,
    cursor: "pointer",
  },
}));

const ResumeSearch: React.FC = () => {
  const classes = useStyles();
  const location = useLocation();
  const { searchState } = useSearch();
  const { getApi, user } = useAuth();
  const [ref, inView] = useInView({ threshold: 1 });
  const [algoliaClient, setAlgoliaClient] = useState<SearchClient>();
  const [hideHeaderSearchBar, setHideHeaderSearchBar] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchHistoryConfig, setSearchHistoryConfig] = useState<string>("");

  useEffect(() => {
    setSearchHistoryConfig(localStorage.getItem("searchHistory") || "");
  }, [location.search]);

  useEffect(() => {
    !loading && setHideHeaderSearchBar(inView);
    inView && setLoading(false);
  }, [inView, loading]);

  useEffect(() => {
    const getApiKey = async () => {
      if (user) {
        const userApi = (await getApi("User")) as UserApi;
        const algoliaService = new AlgoliaService(user.uuid, userApi);
        return await algoliaService.getApiKey();
      } else return "";
    };

    const setClient = async () => {
      const apiKey = await getApiKey();
      const algoliaClient = algoliasearch(algoliaApplicantConfig.appId, apiKey);
      setAlgoliaClient(algoliaClient);
    };
    setClient();
  }, [user, getApi]);

  return (
    <div className={classes.root}>
      <SitelinksSearchboxStructuredData />
      <Header hideSearchBar={hideHeaderSearchBar} />
      <div className={classes.container}>
        {algoliaClient ? (
          <InstantSearch
            indexName={algoliaApplicantConfig.index}
            searchClient={algoliaClient}
          >
            <Configure hitsPerPage={20} />
            <div ref={ref}>
              <ApplicantSearchBar />
            </div>
            <ApplicantList />
            <SearchResult searchApplicant />
          </InstantSearch>
        ) : (
          <div className={classes.searchBarRoot}>
            <InputBase className={classes.input} placeholder="搜尋人才、履歷" />
            <IconButton className={classes.iconButton}>
              <Search />
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeSearch;
