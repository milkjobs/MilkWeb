import { environment, googleAnalyticsConfig } from "config";
import React from "react";
import { Helmet } from "react-helmet-async";

const GoogleAnalyticsService: React.FC = () => {
  return environment === "production" ? (
    <Helmet>
      {/* Global site tag (gtag.js) - Google Analytics */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsConfig.measurementId}`}
      ></script>
      <script>{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', '${googleAnalyticsConfig.measurementId}');
      `}</script>
    </Helmet>
  ) : null;
};

export default GoogleAnalyticsService;
