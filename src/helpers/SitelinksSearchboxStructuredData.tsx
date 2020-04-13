import React from "react";
import { Helmet } from "react-helmet-async";

/*
  https://schema.org/WebSite
  https://developers.google.com/search/docs/data-types/sitelinks-searchbox#datatypes
  https://search.google.com/structured-data/testing-tool
*/
const SitelinksSearchboxStructuredData: React.FC = () => {
  const data = {
    "@context": "http://schema.org",
    "@type": "WebSite",
    url: "https://milk.jobs/",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://milk.jobs/?job={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
};

export { SitelinksSearchboxStructuredData };
