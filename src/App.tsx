import CssBaseline from "@material-ui/core/CssBaseline";
import logo from "assets/milk.png";
import { ErrorCatcher, PageMetadata } from "helpers";
import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Route, RouteProps, Switch } from "react-router-dom";
import PageView from "routes/PageView";
import RecruiterRoute from "routes/RecruiterRoute";
import RootRoute from "routes/RootRoute";
import { AuthProvider, ThemeProvider, useAuth } from "stores";
import "./App.css";
import { ChannelProvider } from "stores/channel";

const LoadingRoute: React.FC<RouteProps> = props => {
  const { loading } = useAuth();

  return loading ? null : <Route {...props} />;
};

const AppRouter: React.FC<{}> = () => {
  return (
    <div className="App">
      <PageMetadata
        title="牛奶找工作，大學生的求職平台：工作，是為了更好的生活"
        description="牛奶找工作，專注於大學生、新鮮人的求職機會。我們的 App 提供最快速、直接的求職求才服務。求職者與公司直接聊、加快面試、即時反饋，隨時隨地都能掌握人才的訊息。"
        image={logo}
      />
      <BrowserRouter>
        <ErrorCatcher>
          <LoadingRoute path="/" component={PageView} />
          <Switch>
            <LoadingRoute path="/recruiter" component={RecruiterRoute} />
            <LoadingRoute path="/" component={RootRoute} />
          </Switch>
        </ErrorCatcher>
      </BrowserRouter>
    </div>
  );
};

const App: React.FC<{}> = () => {
  return (
    <ThemeProvider>
      <HelmetProvider>
        <AuthProvider>
          <ChannelProvider>
            <CssBaseline />
            <AppRouter />
          </ChannelProvider>
        </AuthProvider>
      </HelmetProvider>
    </ThemeProvider>
  );
};

export default App;
