import { LoginDialog } from "components/Util";
import { NotFound } from "helpers";
import React from "react";
import {
  Route,
  RouteComponentProps,
  RouteProps,
  Switch
} from "react-router-dom";
import About from "routes/About";
import ApplicantProfile from "routes/ApplicantProfile";
import AwesomeList from "routes/AwesomeList";
import Captcha from "routes/Captcha";
import Chat from "routes/Chat";
import HelpRoute from "routes/HelpRoute";
import Job from "routes/Job";
import JobSearch from "routes/JobSearch";
import JobStatistics from "routes/JobStatistics";
import JoinTeam from "routes/JoinTeam";
import Message from "routes/Message";
import Resume from "routes/Resume";
import SampleMessage from "routes/SampleMessage";
import Stories from "routes/Stories";
import Team from "routes/Team";
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

const MessageRoute: React.FC = () => {
  return (
    <ChannelProvider>
      <Switch>
        <PrivateRoute path="/message/:id" exact component={Message} />
        <PrivateRoute path="/message/" exact component={Message} />
      </Switch>
    </ChannelProvider>
  );
};

const RootRoute: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact component={JobSearch} />
      <Route path="/about" exact component={About} />
      <Route path="/help" component={HelpRoute} />
      <Route path="/captcha" component={Captcha} />
      <Route path="/job/:id" exact component={Job} />
      <Route path="/job/:id/stat" exact component={JobStatistics} />
      <Route path="/team/:id" exact component={Team} />
      <Route path="/sample-message" exact component={SampleMessage} />
      <Route path="/stories" exact component={Stories} />
      <Route path="/chat" exact component={Chat} />
      <Route path="/awesome/:name" exact component={AwesomeList} />
      <PrivateRoute path="/profile" exact component={ApplicantProfile} />
      <PrivateRoute path="/resume" exact component={Resume} />
      <PrivateRoute path="/message/" component={MessageRoute} />
      <PrivateRoute path="/join" exact component={JoinTeam} />
      <Route path="/" component={NotFound} />
    </Switch>
  );
};

export default RootRoute;
