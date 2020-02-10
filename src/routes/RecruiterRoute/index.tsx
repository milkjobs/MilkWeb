import { LoginDialog } from "components/Util";
import { NotFound } from "helpers";
import React from "react";
import {
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
  Switch,
  useRouteMatch
} from "react-router-dom";
import CreateJob from "routes/CreateJob";
import RecruiterJob from "routes/Recruiter/Job";
import Message from "routes/Recruiter/Message";
import RecruiterProfile from "routes/Recruiter/Profile";
import Verification from "routes/Recruiter/Verification";
import RecruiterVisitorsToBe from "routes/Recruiter/VisitorsToBe";
import RecruiterOrder from "routes/RecruiterOrder";
import RecruiterPositionsHome from "routes/RecruiterPositionsHome";
import RecruitersManagement from "routes/RecruitersManagement";
import RecruiterTeam from "routes/RecruiterTeam";
import { ChannelProvider, useAuth } from "stores";

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

        return (
          <LoginDialog
            isOpen={true}
            close={() => {
              // Do nothing.
            }}
          />
        );
      }}
    />
  );
};

const MessageRoute: React.FC = () => {
  const match = useRouteMatch();

  return (
    <ChannelProvider>
      <Switch>
        <PrivateRoute path={match.path} exact component={Message} />
        <PrivateRoute path={`${match.path}/:id`} exact component={Message} />
      </Switch>
    </ChannelProvider>
  );
};

const RecruiterRoute: React.FC = () => {
  const match = useRouteMatch();

  return (
    match && (
      <Switch>
        <PrivateRoute
          path={match.path}
          exact
          component={RecruiterPositionsHome}
        />
        <PrivateRoute
          path={`${match.path}/profile`}
          exact
          component={RecruiterProfile}
        />
        <PrivateRoute
          path={`${match.path}/team`}
          exact
          component={RecruiterTeam}
        />
        <PrivateRoute path={`${match.path}/job/:id`} component={RecruiterJob} />
        <PrivateRoute
          path={`${match.path}/verification`}
          component={Verification}
        />
        <PrivateRoute
          path={`${match.path}/positions`}
          component={RecruiterPositionsHome}
        />
        <PrivateRoute
          path={`${match.path}/management`}
          component={RecruitersManagement}
        />
        <PrivateRoute
          path={`${match.path}/visitorsToBe`}
          component={RecruiterVisitorsToBe}
        />
        <PrivateRoute path={`${match.path}/order`} component={RecruiterOrder} />
        <PrivateRoute
          path={`${match.path}/create-a-job/`}
          component={CreateJob}
        />
        <PrivateRoute path={`${match.path}/message`} component={MessageRoute} />
        {/* <PrivateRoute
          path={`${match.path}/recommend-candidates`}
          component={RecommendCandidatesHome}
        /> */}
        <Route path={`${match.path}`} component={NotFound} />
      </Switch>
    )
  );
};

export default RecruiterRoute;
