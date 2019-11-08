import { makeStyles } from "@material-ui/core/styles";
import { Header } from "components/Header";
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import HelpCenter from "routes/HelpCenter";
import PrivacyPolicy from "routes/HelpCenter/PrivacyPolicy";
import { NotFound } from "helpers";

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.default
  }
}));

const HelpRoute: React.FC = () => {
  const match = useRouteMatch();
  const classes = useStyles();

  return (
    match && (
      <div className={classes.root}>
        <Header />

        <Switch>
          <Route path={`${match.path}`} exact component={HelpCenter} />
          <Route
            path={`${match.path}/privacy-policy`}
            exact
            component={PrivacyPolicy}
          />
          <Route path={`${match.path}`} component={NotFound} />
        </Switch>
      </div>
    )
  );
};

export default HelpRoute;
