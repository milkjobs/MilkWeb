import { JobRecord } from "@frankyjuang/milkapi-client";
import { CircularProgress, makeStyles, Button } from "@material-ui/core";
import React from "react";
import {
  connectStateResults,
  StateResultsProvided,
} from "react-instantsearch-core";
import { useHistory } from "react-router-dom";

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
  recommend?: boolean;
}

const SearchResult: React.FC<SearchResultProps> = ({
  isSearchStalled,
  searchResults,
  recommend,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const { nbHits, page, hitsPerPage, nbPages } = searchResults || {};
  const actualHits = page + 1 < nbPages ? hitsPerPage * (page + 1) : nbHits;

  return (
    <>
      <div className={classes.container}>
        {isSearchStalled ? (
          <CircularProgress />
        ) : actualHits > 0 ? (
          `${actualHits} 位人才`
        ) : (
          "目前沒有相關人才"
        )}
      </div>
      {recommend && (
        <>
          <div className={classes.container}>
            {`牛奶找工作正在學習，如何智慧推薦最適合的求職者給你`}
            <br />
            {`這個系統會隨著時間越久越進步`}
            <br />
            {`若推薦的結果不甚滿意，可以先使用人才搜尋，主動找適合自己的求職者`}
            <br />
          </div>
          <Button
            variant={"contained"}
            color={"secondary"}
            style={{ width: 200, marginLeft: "auto", marginRight: "auto" }}
            onClick={() => history.push("/recruiter/search")}
          >
            {"人才搜尋"}
          </Button>
        </>
      )}
    </>
  );
};

const ConnectedSearchResult = connectStateResults(SearchResult);

export { ConnectedSearchResult as SearchResult };
