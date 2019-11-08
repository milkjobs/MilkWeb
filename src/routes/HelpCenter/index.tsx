import { makeStyles } from "@material-ui/core";
import { Header } from "components/Header";
import React from "react";
import { useRouteMatch } from "react-router";
import { Link } from "react-router-dom";

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
    flexDirection: "column",
    width: "100%",
    alignItems: "start",
    justifyContent: "start",
    [theme.breakpoints.up("md")]: {
      width: 900,
      marginRight: "auto",
      marginLeft: "auto"
    }
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    textAlign: "left",
    marginBottom: 12
  },
  item: {
    color: theme.palette.text.primary,
    textDecoration: "none"
  }
}));

const HelpCenter: React.FC = () => {
  const match = useRouteMatch();
  const classes = useStyles();

  return (
    match && (
      <div className={classes.root}>
        <Header />
        <div className={classes.container}>
          <div className={classes.title}>幫助中心</div>
          <Link to={`${match.path}/privacy-policy`} className={classes.item}>
            <div>隱私權政策</div>
          </Link>
        </div>
      </div>
    )
  );
};

export default HelpCenter;
