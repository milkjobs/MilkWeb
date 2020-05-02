import { UserApi, SalaryType } from "@frankyjuang/milkapi-client";
import { IconButton, InputBase, makeStyles } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import algoliasearch, { SearchClient } from "algoliasearch/lite";
import { AwesomeHeader } from "components/Awesome";
import { Header } from "components/Header";
import { JobList, SearchBar } from "components/JobSearch";
import { SearchResult } from "components/JobSearch/SearchResult";
import { algoliaConfig } from "config";
import "firebase/analytics";
import { AlgoliaService, SitelinksSearchboxStructuredData } from "helpers";
import React, { useEffect, useState } from "react";
import {
  Configure,
  InstantSearch,
  connectRefinementList,
  connectRange,
} from "react-instantsearch-dom";
import { useInView } from "react-intersection-observer";
import { useLocation } from "react-router-dom";
import { useAuth } from "stores";
import { FilterHeader } from "components/Filter";
import { useSearch } from "stores";
import { UserCard } from "components/Profile";

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
    alignItems: "flex-start",
    marginRight: "auto",
    marginLeft: "auto",
    flexDirection: "row",
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up("lg")]: {
      marginRight: "auto",
      marginLeft: "auto",
    },
    [theme.breakpoints.only("md")]: {
      width: "100%",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      marginTop: 8,
      marginBottom: 8,
    },
  },
  jobSearchContainer: {
    display: "flex",
    justifyContent: "center",
    paddingRight: 24,
    paddingLeft: 24,
    flexDirection: "column",
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up("lg")]: {
      width: "960px",
    },
    [theme.breakpoints.only("md")]: {
      flex: 3,
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  userCardContainer: {
    [theme.breakpoints.up("lg")]: {
      minWidth: "250px",
    },
    [theme.breakpoints.only("md")]: {
      flex: 1,
    },
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  searchBarRoot: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    flex: 1,
    maxHeight: 50,
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

interface News {
  name: string;
  website: string;
}

const VirtualRefinementList = connectRefinementList(() => null);
const VirtualRange = connectRange(() => null);

const JobSearch: React.FC = () => {
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
      // if (user) {
      //   const userApi = (await getApi("User")) as UserApi;
      //   const algoliaService = new AlgoliaService(user.uuid, userApi);
      //   return await algoliaService.getApiKey();
      // }
      const miscApi = await getApi("Misc");
      const algoliaCredential = await miscApi.getAnonymousAlgoliaCredential();
      return algoliaCredential.apiKey;
    };

    const setClient = async () => {
      const apiKey = await getApiKey();
      const algoliaClient = algoliasearch(algoliaConfig.appId, apiKey);
      setAlgoliaClient(algoliaClient);
    };
    setClient();
  }, [user, getApi]);

  return (
    <div className={classes.root}>
      <SitelinksSearchboxStructuredData />
      <Header hideSearchBar={hideHeaderSearchBar} />
      <div className={classes.container}>
        <div className={classes.jobSearchContainer}>
          <div style={{ padding: 16 }}>
            <AwesomeHeader />
          </div>
          {algoliaClient ? (
            <InstantSearch
              indexName={algoliaConfig.index}
              searchClient={algoliaClient}
            >
              <Configure
                hitsPerPage={20}
                optionalWords={[
                  ...searchHistoryConfig.split(" "),
                  SalaryType.Monthly,
                  SalaryType.Hourly,
                ]}
              />
              <div ref={ref}>
                <SearchBar />
              </div>
              <VirtualRefinementList attribute="area.level2" />
              <VirtualRefinementList attribute="type" />
              <VirtualRefinementList attribute="team.primaryField" />
              <VirtualRefinementList attribute="educationNeed" />
              <VirtualRefinementList attribute="experienceNeed" />
              <VirtualRange attribute="minSalary" />
              <VirtualRange attribute="maxSalary" />
              <FilterHeader />
              <JobList />
              <SearchResult />
            </InstantSearch>
          ) : (
            <div className={classes.searchBarRoot}>
              <InputBase
                className={classes.input}
                placeholder="搜尋工作、地區、公司"
              />
              <IconButton className={classes.iconButton}>
                <Search />
              </IconButton>
            </div>
          )}
        </div>
        <div className={classes.userCardContainer}>
          <UserCard />
        </div>
      </div>
    </div>
  );
};

export default JobSearch;
