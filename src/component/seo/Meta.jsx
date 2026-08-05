/* Developed by Grafizen International PVT. LTD. */

import React from "react";
import { Helmet } from "react-helmet";

export const Meta = ({
  title,
  description,
  keywords,
  author,
  ogTitle,
  ogDescription,
  ogImage,
  twitterCard = "summary_large_image",
}) => {
  return (
    <Helmet>

      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}

      <meta property="og:type" content="website" />
      <meta property="og:title" content={ogTitle || title} />
      {ogDescription && <meta property="og:description" content={ogDescription} />}
      {ogImage && <meta property="og:image" content={ogImage} />}

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={ogTitle || title} />
      {ogDescription && <meta name="twitter:description" content={ogDescription} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  );
};