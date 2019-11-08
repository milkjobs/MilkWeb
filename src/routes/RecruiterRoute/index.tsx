import { LoginDialog } from "components/Util";
import { LocalStorageItem, NotFound } from "helpers";
import React from "react";
import {
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
  Switch,
  useRouteMatch
} from "react-router";
import CreateJob from "routes/CreateJob";
import CreateTeam from "routes/CreateTeam";
import RecruiterJob from "routes/Recruiter/Job";
import RecruiterPoint from "routes/Recruiter/Point";
import RecruiterOrder from "routes/RecruiterOrder";
import RecruiterPositionsHome from "routes/RecruiterPositionsHome";
import RecruiterTeam from "routes/RecruiterTeam";
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
  const { isAuthenticated, user } = useAuth();

  return (
    <Route
      {...rest}
      render={props => {
        if (isAuthenticated) {
          return user && user.recruiterInfo ? (
            <Component {...props} />
          ) : (
            <Redirect to="/" />
          );
        }

        localStorage.setItem(
          LocalStorageItem.RedirectPath,
          `${props.location.pathname}${props.location.search}${props.location.hash}`
        );

        return <LoginDialog isOpen={true} close={() => {}} />;
      }}
    />
  );
};

const RecruiterRoute: React.FC = () => {
  const match = useRouteMatch();

  return (
    match && (
      <Switch>
        <PrivateRoute
          path={`${match.path}`}
          exact
          component={RecruiterPositionsHome}
        />
        <PrivateRoute
          path={`${match.path}/team`}
          exact
          component={RecruiterTeam}
        />
        <PrivateRoute path={`${match.path}/job/:id`} component={RecruiterJob} />
        <PrivateRoute
          path={`${match.path}/create-team`}
          component={CreateTeam}
        />
        <PrivateRoute
          path={`${match.path}/positions`}
          component={RecruiterPositionsHome}
        />
        <PrivateRoute path={`${match.path}/point`} component={RecruiterPoint} />
        <PrivateRoute path={`${match.path}/order`} component={RecruiterOrder} />
        <PrivateRoute
          path={`${match.path}/create-a-job/`}
          component={CreateJob}
        />
        {/* <PrivateRoute
          path={`${match.path}/recommend-candidates`}
          component={RecommendCandidatesHome}
        />
        <PrivateRoute
          path={`${match.path}/message`}
          component={RecruiterMessageHome}
        /> */}
        <Route path={`${match.path}`} component={NotFound} />
      </Switch>
    )
  );
};

export default RecruiterRoute;
