import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import policyFile from "assets/privacy-policy-cht.md";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

const styles = (theme: Theme) =>
  createStyles({
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
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: 900,
        marginRight: "auto",
        marginLeft: "auto"
      }
    },
    markdownContainer: {
      textAlign: "left"
    }
  });

const PrivacyPolicy: React.FC<WithStyles<typeof styles>> = props => {
  const { classes } = props;
  const [policy, setPolicy] = useState<string>("");

  useEffect(() => {
    fetch(policyFile).then(async res => setPolicy(await res.text()));
  }, []);

  return (
    <div className={classes.container}>
      <ReactMarkdown
        source={policy}
        className={classes.markdownContainer}
        linkTarget="_blank"
      />
    </div>
  );
};

export default withStyles(styles)(PrivacyPolicy);
