import { makeStyles } from "@material-ui/core/styles";
import policyFile from "assets/faq.md";
import to from "await-to-js";
import { Header } from "components/Header";
import React, { ReactType, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useLocation } from "react-router-dom";

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

const flatten = (text, child) => {
  return typeof child === "string"
    ? text + child
    : React.Children.toArray(child.props.children).reduce(flatten, text);
};

// https://github.com/rexxars/react-markdown/issues/69#issuecomment-289860367
const HeadingRenderer: ReactType = props => {
  const children = React.Children.toArray(props.children);
  const text = children.reduce(flatten, "");
  const slug = text.toLowerCase().replace(/\s/g, "-");
  const anchorChildren = (
    <a
      href={`#${slug}`}
      className="title"
      style={{ color: "black", textDecoration: "none" }}
    >
      {props.children}
    </a>
  );

  return React.createElement("h" + props.level, { id: slug }, anchorChildren);
};

const Faq: React.FC = () => {
  const classes = useStyles();
  const { hash } = useLocation();
  const [policy, setPolicy] = useState<string>();

  useEffect(() => {
    const init = async () => {
      const [, res] = await to(fetch(policyFile));
      res && setPolicy(await res.text());

      // Jump to hash.
      if (hash.length > 0) {
        const anchorId = decodeURIComponent(hash.substring(1));
        const element = document.getElementById(anchorId);
        element?.scrollIntoView();
      }
    };
    init();
  }, [hash]);

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.container}>
        <ReactMarkdown
          source={policy}
          className={classes.markdownContainer}
          linkTarget="_blank"
          renderers={{
            heading: HeadingRenderer
          }}
        />
      </div>
    </div>
  );
};

export default Faq;
