import { LoginDialog } from "components/Util";
import { NotFound } from "helpers";
import React from "react";
import {
  Route,
  RouteComponentProps,
  RouteProps,
  Switch,
} from "react-router-dom";
import About from "routes/About";
import AwesomeList from "routes/AwesomeList";
import Captcha from "routes/Captcha";
import Chat from "routes/Chat";
import DepartmentList from "routes/DepartmentList";
import Help from "routes/Help";
import Job from "routes/Job";
import JobSearch from "routes/JobSearch";
import JobStatistics from "routes/JobStatistics";
import JoinTeam from "routes/JoinTeam";
import Message from "routes/Message";
import Profile from "routes/Profile";
import Resume from "routes/Resume";
import SampleMessage from "routes/SampleMessage";
import Stories from "routes/Stories";
import Team from "routes/Team";
import { useAuth } from "stores";
import Bottles from "routes/Bottles";
import JobCircle from "routes/JobCircle";
import JobCircleTheme from "routes/JobCircleTheme";
import JobCirclePost from "routes/JobCirclePost";
import EmailConfirm from "routes/EmailConfirm";
import PublicProfile from "routes/PublicProfile";

interface PrivateRouteProps extends RouteProps {
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const { user, loading } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (loading) {
          return null;
        }
        if (user) {
          return <Component {...props} />;
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

const RootRoute: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact component={JobSearch} />
      <Route path="/about" exact component={About} />
      <Route path="/awesome/:name" exact component={AwesomeList} />
      <Route path="/captcha" exact component={Captcha} />
      <Route path="/chat" exact component={Chat} />
      <Route path="/departments" exact component={DepartmentList} />
      <Route path="/help" component={Help} />
      <Route path="/confirm-email" component={EmailConfirm} />
      <Route path="/job/:id" exact component={Job} />
      <Route path="/job/:id/stat" exact component={JobStatistics} />
      <Route path="/sample-message" exact component={SampleMessage} />
      <Route path="/stories" exact component={Stories} />
      <Route path="/circle/" exact component={JobCircle} />
      <Route path="/circle/theme/:id" exact component={JobCircleTheme} />
      <Route path="/circle/:id" exact component={JobCirclePost} />
      <Route path="/bottle" exact component={Bottles} />
      <Route path="/bottle/:id" exact component={Bottles} />
      <Route path="/team/:id" component={Team} />
      <PrivateRoute path="/join" exact component={JoinTeam} />
      <PrivateRoute path="/message" exact component={Message} />
      <PrivateRoute path="/message/:id" exact component={Message} />
      <PrivateRoute path="/profile" exact component={Profile} />
      <PrivateRoute
        path="/public-profile/:id"
        exact
        component={PublicProfile}
      />
      <PrivateRoute path="/resume" exact component={Resume} />
      <Route path="/" component={NotFound} />
    </Switch>
  );
};

export default RootRoute;
