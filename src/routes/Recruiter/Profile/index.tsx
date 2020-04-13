import { makeStyles } from "@material-ui/core/styles";
import { Header } from "components/Header";
import { RecruiterBasicInfo } from "components/Profile";
import React from "react";

const useStyles = makeStyles((theme) => ({
  container: {
    alignContent: "stretch",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    marginBottom: 30,
    marginLeft: 48,
    marginRight: 24,
    marginTop: 40,
  },
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

const RecruiterProfile: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.container}>
        <RecruiterBasicInfo />
      </div>
    </div>
  );
};

export default RecruiterProfile;
