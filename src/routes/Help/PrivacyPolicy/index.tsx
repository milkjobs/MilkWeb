import { makeStyles } from "@material-ui/core/styles";
import policyFile from "assets/privacy-policy-cht.md";
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginBottom: 100,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 40,
    paddingLeft: 24,
    paddingRight: 24,
    [theme.breakpoints.up("md")]: {
      width: "960px"
    }
  },
  markdownContainer: {
    textAlign: "left"
  }
}));

const PrivacyPolicy: React.FC = () => {
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

export default PrivacyPolicy;
