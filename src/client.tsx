import * as Sentry from "@sentry/browser";
import branch from "branch-sdk";
import {
  branchConfig,
  environment,
  firebaseConfig,
  sentryConfig,
} from "config";
import firebase from "firebase/app";
import { default as React } from "react";
import { hydrate } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "./polyfills";

console.log(firebase);
branch.init(branchConfig.key);
firebase.initializeApp(firebaseConfig);

Sentry.init({
  dsn: sentryConfig.dsn,
  environment: environment,
  enabled: environment !== "local",
});

hydrate(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);

if (module.hot) {
  module.hot.accept();
}
