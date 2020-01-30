import React from "react";
import { Helmet } from "react-helmet-async";

interface Props {
  title: string;
  description?: string;
  image?: string;
}

/*
  TODO: implant to every shareable page after implementing server-side rendering.
  Facebook doc: https://developers.facebook.com/docs/sharing/webmasters/
  Facebook debug: https://developers.facebook.com/tools/debug/sharing/
  Twitter doc: https://developer.twitter.com/en/docs/tweets/optimize-with-cards/overview/summary
  Twitter debug: https://cards-dev.twitter.com/validator
  Linkedin debug: https://www.linkedin.com/post-inspector/inspect/
*/
const PageMetadata: React.FC<Props> = props => {
  const { title, description, image } = props;
  const location = window.location;

  return (
    <Helmet>
      <title>{title}</title>
      <meta
        property="og:url"
        content={`${location.protocol}//${location.host}${location.pathname}`}
      />
      <meta property="og:title" content={title} />
      <meta property="og:locale" content="zh_TW" />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@themilkjobs" />
    </Helmet>
  );
};

export default PageMetadata;
