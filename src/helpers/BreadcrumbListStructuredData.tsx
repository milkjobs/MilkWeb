import React from "react";
import { Helmet } from "react-helmet-async";

interface BreadCrumb {
  name: string;
  url: string;
}

interface Props {
  breadcrumbs: BreadCrumb[];
}

/*
  https://schema.org/BreadcrumbList
  https://developers.google.com/search/docs/data-types/breadcrumb#definitions
  https://search.google.com/structured-data/testing-tool
*/
const BreadcrumbListStructuredData: React.FC<Props> = ({ breadcrumbs }) => {
  if (breadcrumbs.length < 2) {
    throw new Error("Must have at least two breadcrumbs.");
  }

  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((bc, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: bc.name,
      item: bc.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
};

export { BreadcrumbListStructuredData };
