import * as Sentry from "@sentry/browser";
import branch from "branch-sdk";
import {
  branchConfig,
  environment,
  firebaseConfig,
  sentryConfig,
} from "config";
import firebase from "firebase/app";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import "./polyfills";
import * as serviceWorker from "./serviceWorker";

branch.init(branchConfig.key);
firebase.initializeApp(firebaseConfig);

Sentry.init({
  dsn: sentryConfig.dsn,
  environment: environment,
  enabled: environment !== "local",
});

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
