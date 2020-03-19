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
import { useAuth } from "stores";
import Member from "./Member";
import Message from "./Message";
import Position from "./Position";
import Positions from "./Positions";
import Profile from "./Profile";
import Team from "./Team";
import Verification from "./Verification";
import VisitorsToBe from "./VisitorsToBe";

interface PrivateRouteProps extends RouteProps {
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const { loading, user } = useAuth();

  return (
    <Route
      {...rest}
      render={props => {
        if (loading) {
          return null;
        }
        if (user) {
          return user.recruiterInfo ? (
            <Component {...props} />
          ) : (
            <Redirect to="/" />
          );
        }

        return (
          <LoginDialog
            {...props}
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

const RecruiterRoute: React.FC = () => {
  const match = useRouteMatch();

  return (
    match && (
      <Switch>
        <PrivateRoute path={match.path} exact component={Positions} />
        <PrivateRoute
          path={`${match.path}/profile`}
          exact
          component={Profile}
        />
        <PrivateRoute path={`${match.path}/team`} exact component={Team} />
        <PrivateRoute
          path={`${match.path}/job/:id`}
          exact
          component={Position}
        />
        <PrivateRoute
          path={`${match.path}/verification`}
          exact
          component={Verification}
        />
        <PrivateRoute
          path={`${match.path}/positions`}
          exact
          component={Positions}
        />
        <PrivateRoute path={`${match.path}/member`} exact component={Member} />
        <PrivateRoute
          path={`${match.path}/visitors-to-be`}
          component={VisitorsToBe}
        />
        <PrivateRoute
          path={`${match.path}/message`}
          exact
          component={Message}
        />
        <PrivateRoute
          path={`${match.path}/message/:id`}
          exact
          component={Message}
        />
        <Route path={match.path} component={NotFound} />
      </Switch>
    )
  );
};

export default RecruiterRoute;
