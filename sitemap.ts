import fs from "fs";
import urljoin from "url-join";
import builder from "xmlbuilder";

const staticPaths = [
  "/",
  "/about",
  "/help",
  "/help/tos",
  "/help/privacy",
  "/help/pricing"
];

const generateUrlNode = (url: string) => {
  // Always add trailing slash.
  url = url.endsWith("/") ? url : `${url}/`;

  return {
    url: {
      loc: {
        "#text": url
      },
      "xhtml:link": {
        "@rel": "alternate",
        "@hreflang": "zh",
        "@href": url
      },
      lastmod: {
        "#text": new Date().toISOString().slice(0, 10)
      },
      changefreq: {
        "#text": "daily"
      }
    }
  };
};

const getTeamIds = () => {
  // TODO: get ids from backend.

  return [
    "00380d74a84e40b8bc251d33078b60fd",
    "2ea01256c9894d289d5b9546577aaf80",
    "c181b9e6e3914e73ac53899739d315cb",
    "763f330eb61141e6b77700f02cf68130",
    "f3ffa32e19b940b6b355cbb878793527"
  ];
};

const getJobIds = () => {
  // TODO: get ids from backend.

  return [
    "13bac5eef2f44edba26a099ea583dc04",
    "1b91ed81e3414c84ad3e2e4402b44ad1",
    "29978b1b6dc540f1957b8ceb16715658",
    "2df4e512b9874cb89440043f2f6590ec",
    "9a64e72123ef48d3b565654098d56c34",
    "ea940431f82741499cd5fb97229c2857",
    "d02d4bbbaa56432f9f37e9ff71ee6ba9",
    "b0942a9ab5664651b269938459d96d5f"
  ];
};

const root = builder
  .begin()
  .declaration({ encoding: "UTF-8" })
  .ele("urlset", {
    xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
    "xmlns:xhtml": "http://www.w3.org/1999/xhtml"
  });

staticPaths.forEach(path => {
  const url = urljoin("https://milk.jobs", path);
  const urlNode = generateUrlNode(url);
  root.ele(urlNode);
});

const teamIds = getTeamIds();
teamIds.forEach(teamId => {
  const url = urljoin("https://milk.jobs/team", teamId);
  const urlNode = generateUrlNode(url);
  root.ele(urlNode);
});

const jobIds = getJobIds();
jobIds.forEach(teamId => {
  const url = urljoin("https://milk.jobs/job", teamId);
  const urlNode = generateUrlNode(url);
  root.ele(urlNode);
});

const xml = root.end({ pretty: true, spaceBeforeSlash: true });

fs.writeFile("public/sitemap.xml", xml, () => {});
