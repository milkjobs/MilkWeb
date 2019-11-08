import CssBaseline from "@material-ui/core/CssBaseline";
import { ErrorCatcher } from "helpers";
import GoogleAnalyticsService from "helpers/GoogleAnalyticsService";
import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Route, RouteProps, Switch } from "react-router-dom";
import PageView from "routes/PageView";
import RecruiterRoute from "routes/RecruiterRoute";
import RootRoute from "routes/RootRoute";
import { AuthProvider, ThemeProvider, useAuth } from "stores";
import "./App.css";

const LoadingRoute: React.FC<RouteProps> = props => {
  const { loading } = useAuth();

  return loading ? null : <Route {...props} />;
};

const AppRouter: React.FC<{}> = () => {
  return (
    <div className="App">
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
          <CssBaseline />
          <GoogleAnalyticsService />
          <AppRouter />
        </AuthProvider>
      </HelmetProvider>
    </ThemeProvider>
  );
};

export default App;
