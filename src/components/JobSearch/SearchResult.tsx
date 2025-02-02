import { JobRecord } from "@frankyjuang/milkapi-client";
import { CircularProgress, makeStyles } from "@material-ui/core";
import React from "react";
import {
  connectStateResults,
  StateResultsProvided,
} from "react-instantsearch-core";

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.hint,
    display: "flex",
    flex: 1,
    fontSize: 18,
    justifyContent: "center",
    marginBottom: 24,
    marginTop: 24,
  },
}));

interface SearchResultProps extends StateResultsProvided<JobRecord> {
  searchApplicant?: boolean;
}

const SearchResult: React.FC<SearchResultProps> = ({
  isSearchStalled,
  searchResults,
  searchApplicant,
}) => {
  const classes = useStyles();
  const { nbHits, page, hitsPerPage, nbPages } = searchResults || {};
  const actualHits = page + 1 < nbPages ? hitsPerPage * (page + 1) : nbHits;

  return (
    <div className={classes.container}>
      {isSearchStalled ? (
        <CircularProgress />
      ) : actualHits > 0 ? (
        searchApplicant ? (
          `${actualHits} 位人才`
        ) : (
          `${actualHits} 個工作`
        )
      ) : searchApplicant ? (
        "目前沒有相關人才"
      ) : (
        "目前沒有相關工作"
      )}
    </div>
  );
};

const ConnectedSearchResult = connectStateResults(SearchResult);

export { ConnectedSearchResult as SearchResult };
