import { UserApi, VerificationState, Job } from "@frankyjuang/milkapi-client";
import { makeStyles, Button } from "@material-ui/core";
import algoliasearch, { SearchClient } from "algoliasearch/lite";
import { Header } from "components/Header";
import { ApplicantList } from "components/ApplicantSearch";
import { SearchResult } from "components/ApplicantSearch/SearchResult";
import { algoliaApplicantConfig } from "config";
import "firebase/analytics";
import { AlgoliaService, SitelinksSearchboxStructuredData } from "helpers";
import React, { useEffect, useState } from "react";
import {
  Configure,
  InstantSearch,
  connectRefinementList,
  connectSearchBox,
} from "react-instantsearch-dom";
import { useInView } from "react-intersection-observer";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "stores";
import { useSearch } from "stores";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

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

function a11yProps(index: any) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const VirtualSearchBox = connectSearchBox(() => null);
const VirtualRefinementList = connectRefinementList(() => null);

const ApplicantRecommend: React.FC = () => {
  const classes = useStyles();
  const location = useLocation();
  const { searchState } = useSearch();
  const { getApi, user, reloadUser } = useAuth();
  const [ref, inView] = useInView({ threshold: 1 });
  const [algoliaClient, setAlgoliaClient] = useState<SearchClient>();
  const [hideHeaderSearchBar, setHideHeaderSearchBar] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchHistoryConfig, setSearchHistoryConfig] = useState<string>("");
  const [value, setValue] = React.useState(0);
  const [positions, setPositions] = useState<Job[]>([]);

  useEffect(() => {
    if (user?.recruiterInfo?.jobs) {
      setPositions(user.recruiterInfo.jobs);
    }
  }, [user]);

  function handleChange(event: React.ChangeEvent<{}>, newValue: number) {
    setValue(newValue);
  }

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

  const publish = async () => {
    setPositions(
      positions.map((p, i) => {
        if (i === value) {
          p.published = true;
        }
        return p;
      })
    );
    const jobApi = await getApi("Job");
    const updatedJob = await jobApi.updateJob({
      jobId: positions[value].uuid,
      job: { ...positions[value], published: true },
    });
  };

  return (
    <div className={classes.root}>
      <SitelinksSearchboxStructuredData />
      <Header hideSearchBar={hideHeaderSearchBar} />
      <div className={classes.container}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="secondary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
          style={{ marginBottom: 16 }}
        >
          {positions.map((p, i) => (
            <Tab label={p.name} key={i} {...a11yProps(i)} />
          ))}
        </Tabs>
        {user?.recruiterInfo?.team?.certificateVerified !==
        VerificationState.Passed ? (
          <Link
            to={"/recruiter/verification"}
            style={{ textDecoration: "none", fontSize: 24 }}
          >
            <Button style={{ textDecoration: "none", fontSize: 24 }}>
              {"公司驗證通過後才能使用人才推薦的功能"}
            </Button>
          </Link>
        ) : algoliaClient ? (
          positions[value].published ? (
            <InstantSearch
              indexName={algoliaApplicantConfig.index}
              searchClient={algoliaClient}
            >
              <Configure
                hitsPerPage={20}
                optionalWords={[
                  positions[value].title || positions[value].name,
                ]}
              />
              <VirtualSearchBox
                defaultRefinement={
                  positions[value].title || positions[value].name
                }
              />
              <VirtualRefinementList
                attribute="jobGoal.area"
                operator={"or"}
                defaultRefinement={[positions[value].address.area]}
              />
              <ApplicantList />
              <SearchResult recommend />
            </InstantSearch>
          ) : (
            <Button
              color={"secondary"}
              variant={"contained"}
              style={{
                marginTop: 32,
                width: 300,
                marginLeft: "auto",
                marginRight: "auto",
              }}
              onClick={publish}
            >
              {"發布職缺後，即可看到推薦人才"}
            </Button>
          )
        ) : (
          <div className={classes.searchBarRoot}></div>
        )}
      </div>
    </div>
  );
};

export default ApplicantRecommend;
