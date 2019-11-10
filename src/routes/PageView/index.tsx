import { googleAnalyticsConfig } from "config";
import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

declare global {
  interface Window {
    gtag: Gtag.Gtag;
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
const PageView: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const gtag = window.gtag;

    if (typeof gtag === "function" && history.action === "PUSH") {
      gtag("config", googleAnalyticsConfig.measurementId, {
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
