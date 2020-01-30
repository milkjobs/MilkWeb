import fs from "fs";
import urljoin from "url-join";
import builder from "xmlbuilder";

const staticPaths = [
  "/",
  "/about",
  "/stories",
  "/help",
  "/help/tos",
  "/help/privacy",
  "/help/faq",
  "/help/pricing",
  "/awesome/台大電機",
  "/awesome/台大資工",
  "/awesome/台大財金",
  "/awesome/台大國企",
  "/awesome/台大工管",
  "/awesome/台大化工",
  "/awesome/台大機械",
  "/awesome/台大公衛",
  "/awesome/台大藥學",
  "/awesome/台大圖資"
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
    "f3ffa32e19b940b6b355cbb878793527",
    "d04644c12dff46099e21bfc6b9bf9ee5",
    "d102548227ca436d87db0d9256219265",
    "e3670876ce3946e78fa58c0668c6065d",
    "b8f498f88fbc4a15889665e3bc5f7597",
    "bced2c7064664c7a82d0cefb772b0b58"
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
    "b0942a9ab5664651b269938459d96d5f",
    "ce451128ba524e7c8303509d6b8c083c",
    "50690c02766d499a9da3fb156e4cfe0a",
    "7e0e7f8c40264c989fb8d10922a08bd8",
    "1eb933257d8d41deaa8199b07b43460e",
    "bec858717b6d4c348a494da37f121187",
    "2739dee640f4409d83a938b8f9acfa2e",
    "429ce6352cca495988e65be92ae20fe0",
    "a56fdfe2aaa0496b9738a3351a4b51d6",
    "ccfac96aecaf4f98bb6d119f0f854e1a",
    "aa1db5920f4e44fb9755c6807758f169"
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
