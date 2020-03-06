import { makeStyles } from "@material-ui/core/styles";
import policyFile from "assets/faq.md";
import to from "await-to-js";
import { Header } from "components/Header";
import { PageMetadata } from "helpers";
import React, { ReactType, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useLocation } from "react-router-dom";

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
      style={{ color: "#484848", textDecoration: "none" }}
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
      <PageMetadata title="常見問題－牛奶找工作" />
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
