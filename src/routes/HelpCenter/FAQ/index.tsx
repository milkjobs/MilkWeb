import { makeStyles } from "@material-ui/core/styles";
import policyFile from "assets/faq.md";
import to from "await-to-js";
import { Header } from "components/Header";
import React, { useEffect, useState, ReactType } from "react";
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

const elements = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6"
};

function Heading({ level, children, ...props }) {
  return React.createElement(elements[level] || elements.h1, props, children);
}

const HeadingBlock: ReactType = props => {
  const renderHtml = () => {
    const { level, children } = props;

    if (children && children.length > 0) {
      const nodeValue = children[0].props.value;
      return (
        <Heading level={`h${level}`} id={nodeValue}>
          <a
            href={`#${nodeValue}`}
            className="title"
            style={{ color: "black", textDecoration: "none" }}
          >
            {children}
          </a>
        </Heading>
      );
    } else {
      return <>{children}</>;
    }
  };
  return <>{renderHtml()}</>;
};

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
          renderers={{
            heading: HeadingBlock
          }}
        />
      </div>
    </div>
  );
};

export default TermsOfService;
