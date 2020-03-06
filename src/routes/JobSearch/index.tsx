import { UserApi } from "@frankyjuang/milkapi-client";
import { IconButton, InputBase, makeStyles } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import algoliasearch, { SearchClient } from "algoliasearch/lite";
import { AwesomeHeader } from "components/Awesome";
import { Header } from "components/Header";
import { JobList, SearchBar } from "components/JobSearch";
import { SearchResult } from "components/JobSearch/SearchResult";
import { algoliaConfig } from "config";
import "firebase/analytics";
import firebase from "firebase/app";
import {
  AlgoliaService,
  checkUrl,
  openInNewTab,
  SitelinksSearchboxStructuredData
} from "helpers";
import React, { useEffect, useState } from "react";
import { Configure, InstantSearch } from "react-instantsearch-dom";
import { useInView } from "react-intersection-observer";
import { useLocation } from "react-router-dom";
import TextLoop from "react-text-loop";
import { useAuth } from "stores";

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper
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
      width: "960px"
    },
    [theme.breakpoints.down("xs")]: {
      marginTop: 8,
      marginBottom: 8
    }
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
      boxShadow: "0 2px 4px rgba(0,0,0,0.1) !important"
    }
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  latestJobs: {
    width: 200,
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
    height: 20
  },
  latestNews: {
    width: 200,
    textAlign: "center",
    fontWeight: 800,
    cursor: "pointer"
  }
}));

interface News {
  name: string;
  website: string;
}

const latestNews: News[] = [
  {
    name: "MixerBox 2020 新鮮人招募中",
    website: "https://milk.jobs/job/2e2aa7dc13c542179559177d265f2183"
  },
  {
    name: "Garena 儲備幹部 3/8 截止",
    website: "https://map.career.garena.tw/"
  },
  {
    name: "華碩 AI 實習 4/30 截止",
    website: "https://aics.asus.com/zh/homepage-tw/"
  },
  {
    name: "Dell 儲備幹部",
    website:
      "https://dell.wd1.myworkdayjobs.com/External/job/Taipei-Taiwan/RG-Advisor--Project-Program-Management_R41987"
  }
];

const JobSearch: React.FC = () => {
  const classes = useStyles();
  const location = useLocation();
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
      }
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

  const onClickTextLoop = (news: News) => {
    firebase.analytics().logEvent("click_news", { name: news.name });
    openInNewTab(checkUrl(news.website));
  };

  return (
    <div className={classes.root}>
      <SitelinksSearchboxStructuredData />
      <Header hideSearchBar={hideHeaderSearchBar} />
      <div className={classes.container}>
        <TextLoop className={classes.latestJobs}>
          {latestNews.map(n => (
            <div
              className={classes.latestNews}
              key={n.name}
              onClick={() => onClickTextLoop(n)}
            >
              {n.name}
            </div>
          ))}
        </TextLoop>
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
              optionalWords={[...searchHistoryConfig.split(" "), "正職"]}
            />
            <div ref={ref}>
              <SearchBar />
            </div>
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
    </div>
  );
};

export default JobSearch;
