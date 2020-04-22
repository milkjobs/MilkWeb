import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import "firebase/analytics";
import firebase from "firebase/app";
import qs from "qs";
import { useLocalStorage } from "helpers";
import React, { useEffect, useState } from "react";
import { SearchBoxProvided } from "react-instantsearch-core";
import { connectSearchBox } from "react-instantsearch-dom";
import { useHistory, useLocation } from "react-router-dom";
import { SalaryType } from "@frankyjuang/milkapi-client";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    flex: 1,
    marginBottom: 18,
    border: "1px solid #dfe1e5",
    borderRadius: 10,
    "&:hover": {
      boxShadow: "0 2px 4px rgba(0,0,0,0.1) !important",
    },
    [theme.breakpoints.down("xs")]: {
      marginBottom: 16,
    },
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
}));

const SearchBar: React.FC<SearchBoxProvided> = (props) => {
  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();
  const { refine, currentRefinement } = props;
  const [query, setQuery] = useState<string>(currentRefinement);
  const [searchHistory, setSearchHistory] = useLocalStorage(
    "searchHistory",
    ""
  );

  useEffect(() => {
    const params = qs.parse(location.search, { ignoreQueryPrefix: true });
    if ("job" in params) {
      const jobQuery = Array.isArray(params.job)
        ? params.job.join(" ")
        : params.job;
      // If not query, use searchHistory as default
      console.warn(searchHistory);
      refine(
        jobQuery ||
          (searchHistory
            ? searchHistory + ` ${SalaryType.Monthly} ${SalaryType.Hourly}`
            : "")
      );
      setQuery(jobQuery || "");
      // eslint-disable-next-line @typescript-eslint/camelcase
      firebase.analytics().logEvent("search", { search_term: jobQuery || "" });
    } else {
      refine(
        searchHistory
          ? searchHistory + ` ${SalaryType.Monthly} ${SalaryType.Hourly}`
          : ""
      );
    }
  }, [location.search, refine]);

  const search = () => {
    const params = qs.parse(location.search, { ignoreQueryPrefix: true });
    params.job = query;
    if (query)
      setSearchHistory(
        [query, ...searchHistory.split(" ").splice(0, 5)].join(" ")
      );
    history.push({ search: qs.stringify(params, { addQueryPrefix: true }) });
  };

  return (
    <div className={classes.root}>
      <InputBase
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            search();
          }
        }}
        className={classes.input}
        placeholder="搜尋工作、地區、公司"
      />
      <IconButton className={classes.iconButton} onClick={search}>
        <SearchIcon />
      </IconButton>
    </div>
  );
};

const ConnectedSearchBar = connectSearchBox(SearchBar);

export { ConnectedSearchBar as SearchBar };
