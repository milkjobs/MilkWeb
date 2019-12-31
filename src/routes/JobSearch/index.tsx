import { UserApi } from "@frankyjuang/milkapi-client";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import algoliasearch from "algoliasearch/lite";
import { Header } from "components/Header";
import { JobList, SearchBar } from "components/JobSearch";
import { algoliaConfig } from "config";
import { AlgoliaService } from "helpers";
import React, { useEffect, useState } from "react";
import { Configure, InstantSearch } from "react-instantsearch-dom";
import { useInView } from "react-intersection-observer";
import { useAuth } from "stores";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

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
  cataloguesContainer: {
    flexDirection: "column",
    display: "none",
    [theme.breakpoints.up("md")]: {
      maxWidth: "100px",
      display: "flex",
      flex: 1
    }
  },
  catalogue: {
    fontSize: 16,
    [theme.breakpoints.up("md")]: {
      width: "100px",
      paddingTop: 12,
      paddingBottom: 12,
      marginTop: 4,
      marginBottom: 4,
      "&:hover": {
        backgroundColor: "#eeeeee",
        borderRadius: 4,
        cursor: "pointer"
      }
    }
  },
  jobsContainer: {
    display: "flex",
    flex: 4,
    flexDirection: "column",
    boxSizing: "border-box",
    [theme.breakpoints.up("md")]: {
      paddingLeft: 24
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
  schoolContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 16
  },
  schoolTitle: {
    fontWeight: 800,
    marginRight: 16
  },
  majorButton: {
    textDecoration: "none"
  }
}));

const JobSearch: React.FC = () => {
  const classes = useStyles();
  const { getApi, user } = useAuth();
  const [ref, inView] = useInView({ threshold: 1 });
  const [algoliaClient, setAlgoliaClient] = useState<algoliasearch.Client>();
  const [hideHeaderSearchBar, setHideHeaderSearchBar] = useState(true);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className={classes.root}>
      <Header hideSearchBar={hideHeaderSearchBar} />
      <div className={classes.container}>
        <div className={classes.schoolContainer}>
          <div className={classes.schoolTitle}>台大就業專區</div>
          <Link to={"/ntu"} className={classes.majorButton}>
            <Button>台大電機</Button>
          </Link>
          <Link to={"/ntu"} className={classes.majorButton}>
            <Button>台大資工</Button>
          </Link>
        </div>
        {algoliaClient ? (
          <InstantSearch
            indexName={algoliaConfig.index}
            searchClient={algoliaClient}
          >
            <Configure hitsPerPage={20} />
            <div ref={ref}>
              <SearchBar />
            </div>
            <JobList />
          </InstantSearch>
        ) : (
          <div className={classes.searchBarRoot}>
            <InputBase
              className={classes.input}
              placeholder="搜尋工作、地區、公司"
            />
            <IconButton className={classes.iconButton} aria-label="Search">
              <SearchIcon />
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSearch;
