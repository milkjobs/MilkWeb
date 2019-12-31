import { makeStyles } from "@material-ui/core/styles";
import { Header } from "components/Header";
import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper
  },
  container: {
    marginTop: 40,
    marginBottom: 40,
    display: "flex",
    justifyContent: "center",
    marginRight: "auto",
    marginLeft: "auto",
    paddingRight: 24,
    paddingLeft: 24,
    flexDirection: "column",
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up("md")]: {
      width: "960px"
    },
    [theme.breakpoints.down("xs")]: {
      marginTop: 8,
      marginBottom: 8
    }
  },
  schoolContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 16
  },
  schoolTitle: {
    fontWeight: 800,
    marginRight: 16
  },
  majorButton: {
    textDecoration: "none"
  }
}));

const JobSearch: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.container}>
        <div className={classes.schoolContainer}>
          <div className={classes.schoolTitle}>台大就業專區</div>
          <Link to={"/ntu"} className={classes.majorButton}>
            <Button>台大電機</Button>
          </Link>
          <Link to={"/ntu"} className={classes.majorButton}>
            <Button>台大資工</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobSearch;
