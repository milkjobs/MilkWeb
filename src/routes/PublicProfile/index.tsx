import { makeStyles } from "@material-ui/core/styles";
import { Header } from "components/Header";
import { PublicApplicantBasicInfo } from "components/Profile";
import React from "react";
import { useParams } from "react-router-dom";

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

const PublicProfile: React.FC = () => {
  const classes = useStyles();
  const params = useParams<{ id: string }>();

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.container}>
        <PublicApplicantBasicInfo userId={params.id} />
      </div>
    </div>
  );
};

export default PublicProfile;
