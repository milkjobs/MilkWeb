import { LoginDialog } from "components/Util";
import { NotFound } from "helpers";
import React from "react";
import {
  Route,
  RouteComponentProps,
  RouteProps,
  Switch
} from "react-router-dom";
import ApplicantProfile from "routes/ApplicantProfile";
import HelpRoute from "routes/HelpRoute";
import Job from "routes/Job";
import JobSearch from "routes/JobSearch";
import Resume from "routes/Resume";
import Team from "routes/Team";
import { useAuth } from "stores";

interface PrivateRouteProps extends RouteProps {
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const { isAuthenticated } = useAuth();

  return (
    <Route
      {...rest}
      render={props => {
        if (isAuthenticated) {
          return <Component {...props} />;
        }

        return <LoginDialog isOpen={true} close={() => {}} />;
      }}
    />
  );
};

const RootRoute: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact component={JobSearch} />
      <Route path="/help" component={HelpRoute} />
      <Route path="/job/:id" exact component={Job} />
      <Route path="/team/:id" exact component={Team} />
      <PrivateRoute path="/profile" exact component={ApplicantProfile} />
      <PrivateRoute path="/resume" exact component={Resume} />
      {/* <PrivateRoute path="/create-team" component={CreateTeam} /> */}
      {/* <PrivateRoute path="/favorite" exact component={JobFavorite} /> */}
      <Route path="/" component={NotFound} />
    </Switch>
  );
};

export default RootRoute;
