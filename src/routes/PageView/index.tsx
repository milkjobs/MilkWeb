import "firebase/analytics";
import firebase from "firebase/app";
import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

const PageView: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (history.action === "PUSH") {
      firebase.analytics().logEvent("page_view", {
        // eslint-disable-next-line @typescript-eslint/camelcase
        page_location: window.location.href,
        // eslint-disable-next-line @typescript-eslint/camelcase
        page_path: location.pathname
      });
    }
  }, [history, location]);

  return null;
};

export default PageView;
