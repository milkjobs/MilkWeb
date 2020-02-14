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
import RecruiterJob from "routes/Recruiter/Job";
import Member from "routes/Recruiter/Member";
import Message from "routes/Recruiter/Message";
import RecruiterPositionsHome from "routes/Recruiter/Positions";
import RecruiterProfile from "routes/Recruiter/Profile";
import RecruiterTeam from "routes/Recruiter/Team";
import Verification from "routes/Recruiter/Verification";
import RecruiterVisitorsToBe from "routes/Recruiter/VisitorsToBe";
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
        <PrivateRoute path={`${match.path}/member`} component={Member} />
        <PrivateRoute
          path={`${match.path}/visitors-to-be`}
          component={RecruiterVisitorsToBe}
        />
        <PrivateRoute path={`${match.path}/message`} component={MessageRoute} />
        {/* TODO: remove deprecated route */}
        <PrivateRoute path={`${match.path}/management`} component={Member} />
        <Route path={match.path} component={NotFound} />
      </Switch>
    )
  );
};

export default RecruiterRoute;
