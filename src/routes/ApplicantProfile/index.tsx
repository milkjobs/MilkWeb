import { makeStyles } from "@material-ui/core/styles";
import { Header } from "components/Header";
import { ApplicantBasicInfo } from "components/Profile";
import React from "react";

const useStyles = makeStyles(theme => ({
  container: {
    marginLeft: 48,
    marginRight: 24,
    marginBottom: 30,
    display: "flex",
    alignItems: "center",
    flexGrow: 1,
    alignContent: "stretch",
    flexDirection: "column"
  },
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper
  }
}));

const ApplicantProfile: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.container}>
        <ApplicantBasicInfo />
      </div>
    </div>
  );
};

export default ApplicantProfile;
