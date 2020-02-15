import { NotFound } from "helpers";
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Faq from "./Faq";
import HelpCenter from "./HelpCenter";
import Pricing from "./Pricing";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfService from "./TermsOfService";

const HelpRoute: React.FC = () => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={match.path} exact component={HelpCenter} />
      <Route
        path={[`${match.path}/privacy`, `${match.path}/privacy-policy`]}
        exact
        component={PrivacyPolicy}
      />
      <Route
        path={[`${match.path}/tos`, `${match.path}/terms-of-service`]}
        exact
        component={TermsOfService}
      />
      <Route
        path={[`${match.path}/pricing`, `${match.path}/charges`]}
        exact
        component={Pricing}
      />
      <Route path={`${match.path}/faq`} exact component={Faq} />
      <Route path={match.path} component={NotFound} />
    </Switch>
  );
};

export default HelpRoute;
