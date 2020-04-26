import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import "firebase/analytics";
import React, { useEffect, useState } from "react";
import { SearchBoxProvided } from "react-instantsearch-core";
import { connectSearchBox } from "react-instantsearch-dom";

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

const ApplicantSearchBar: React.FC<SearchBoxProvided> = (props) => {
  const classes = useStyles();
  const { refine, currentRefinement } = props;
  const [query, setQuery] = useState<string>(currentRefinement);
  const search = () => {
    refine(query);
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
        placeholder={"搜尋人才、履歷"}
      />
      <IconButton className={classes.iconButton} onClick={search}>
        <SearchIcon />
      </IconButton>
    </div>
  );
};

const ConnectedSearchBar = connectSearchBox(ApplicantSearchBar);

export { ConnectedSearchBar as ApplicantSearchBar };
