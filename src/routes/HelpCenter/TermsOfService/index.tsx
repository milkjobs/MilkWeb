import { makeStyles } from "@material-ui/core/styles";
import policyFile from "assets/terms-of-service-cht.md";
import to from "await-to-js";
import { Header } from "components/Header";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.default
  },
  container: {
    marginTop: 8,
    marginLeft: 24,
    marginRight: 24,
    marginBottom: 30,
    display: "flex",
    flexGrow: 1,
    alignContent: "stretch",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.up("md")]: {
      width: 900,
      marginRight: "auto",
      marginLeft: "auto"
    }
  },
  markdownContainer: {
    textAlign: "left"
  }
}));

const TermsOfService: React.FC = () => {
  const classes = useStyles();
  const [policy, setPolicy] = useState<string>();

  useEffect(() => {
    const init = async () => {
      const [, res] = await to(fetch(policyFile));
      res && setPolicy(await res.text());
    };
    init();
  }, []);

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.container}>
        <ReactMarkdown
          source={policy}
          className={classes.markdownContainer}
          linkTarget="_blank"
        />
      </div>
    </div>
  );
};

export default TermsOfService;
