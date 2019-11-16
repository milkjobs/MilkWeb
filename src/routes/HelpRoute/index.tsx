import { makeStyles } from "@material-ui/core/styles";
import { NotFound } from "helpers";
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import HelpCenter from "routes/HelpCenter";
import PrivacyPolicy from "routes/HelpCenter/PrivacyPolicy";
import TermsOfService from "routes/HelpCenter/TermsOfService";
import Charges from "routes/HelpCenter/Charges";
import FAQ from "routes/HelpCenter/FAQ";

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
        <Switch>
          <Route path={`${match.path}`} exact component={HelpCenter} />
          <Route
            path={`${match.path}/privacy-policy`}
            exact
            component={PrivacyPolicy}
          />
          <Route
            path={`${match.path}/terms-of-service`}
            exact
            component={TermsOfService}
          />
          <Route path={`${match.path}/charges`} exact component={Charges} />
          <Route path={`${match.path}/faq`} exact component={FAQ} />
          <Route path={`${match.path}`} component={NotFound} />
        </Switch>
      </div>
    )
  );
};

export default HelpRoute;
