import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import "firebase/analytics";
import firebase from "firebase/app";
import queryString from "query-string";
import React, { useEffect, useState } from "react";
import { SearchBoxProvided } from "react-instantsearch-core";
import { connectSearchBox } from "react-instantsearch-dom";
import { useHistory, useLocation } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    flex: 1,
    marginBottom: 36,
    border: "1px solid #dfe1e5",
    borderRadius: 10,
    "&:hover": {
      boxShadow: "0 2px 4px rgba(0,0,0,0.1) !important"
    },
    [theme.breakpoints.down("xs")]: {
      marginBottom: 16
    }
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  iconButton: {
    padding: 10
  }
}));

const SearchBar: React.FC<SearchBoxProvided> = props => {
  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();
  const { refine, currentRefinement } = props;
  const [query, setQuery] = useState<string>(currentRefinement);

  useEffect(() => {
    const qs = queryString.parse(location.search);
    if ("job" in qs) {
      const jobQuery = Array.isArray(qs.job) ? qs.job.join(" ") : qs.job;
      if (jobQuery) {
        refine(jobQuery);
        setQuery(jobQuery);
        // eslint-disable-next-line @typescript-eslint/camelcase
        firebase.analytics().logEvent("search", { search_term: jobQuery });
      }
    }
  }, [location.search, refine]);

  const search = () => {
    const qs = queryString.parse(location.search);
    qs.job = query;
    history.push({ search: queryString.stringify(qs) });
  };

  return (
    <div className={classes.root}>
      <InputBase
        value={query}
        onChange={e => {
          setQuery(e.target.value);
        }}
        onKeyPress={e => {
          if (e.key === "Enter") {
            search();
          }
        }}
        className={classes.input}
        placeholder="搜尋工作、地區、公司"
      />
      <IconButton
        className={classes.iconButton}
        aria-label="Search"
        onClick={search}
      >
        <SearchIcon />
      </IconButton>
    </div>
  );
};

const ConnectedSearchBar = connectSearchBox(SearchBar);

export { ConnectedSearchBar as SearchBar };
