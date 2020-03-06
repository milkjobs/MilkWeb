import mysqlx from "@mysql/xdevapi";
import fs from "fs";
import mysql from "mysql";
import urljoin from "url-join";
import builder from "xmlbuilder";

const DB_PASSWORD = "PASSWORD";

const staticPaths = [
  "/",
  "/about",
  "/departments",
  "/help",
  "/help/faq",
  "/help/pricing",
  "/help/privacy",
  "/help/tos",
  "/stories",

  // Legacy awesome lists.
  "/awesome/中原建築",
  "/awesome/中興獸醫",
  "/awesome/台大中文",
  "/awesome/台大人類",
  "/awesome/台大公衛",
  "/awesome/台大化學",
  "/awesome/台大化工",
  "/awesome/台大哲學",
  "/awesome/台大國企",
  "/awesome/台大圖資",
  "/awesome/台大土木",
  "/awesome/台大地質",
  "/awesome/台大外文",
  "/awesome/台大工管",
  "/awesome/台大心理",
  "/awesome/台大戲劇",
  "/awesome/台大政治",
  "/awesome/台大數學",
  "/awesome/台大會計",
  "/awesome/台大材料",
  "/awesome/台大機械",
  "/awesome/台大歷史",
  "/awesome/台大法律",
  "/awesome/台大物理",
  "/awesome/台大社會",
  "/awesome/台大經濟",
  "/awesome/台大職治",
  "/awesome/台大藥學",
  "/awesome/台大財金",
  "/awesome/台大資工",
  "/awesome/台大資管",
  "/awesome/台大農經",
  "/awesome/台大農藝",
  "/awesome/台大醫學",
  "/awesome/台大電機",
  "/awesome/台科大建築",
  "/awesome/實踐建築",
  "/awesome/成大建築",
  "/awesome/成大都市計畫學系",
  "/awesome/政大政治",
  "/awesome/東海建築",
  "/awesome/逢甲建築"
];

// Use mysqlx for new authentication protocol introduced in mysql 8.0.
// Usually our local and staging servers use this.
const getPathsX = async () => {
  const session = await mysqlx.getSession({
    host: "localhost",
    port: 33060,
    user: "root",
    password: DB_PASSWORD
  });

  let paths: string[] = [];

  try {
    await session.sql("USE milk").execute();
    const awesomeResult = await session
      .sql("SELECT `Name`, `School` FROM `Departments`")
      .execute();
    const awesomeLists: string[][] = await awesomeResult.fetchAll();
    paths.push(...awesomeLists.map(l => `/awesome/${l[1]}${l[0]}`));

    const teamResult = await session
      .sql(
        "SELECT `Uuid` FROM `Teams` WHERE `CertificateVerified` = 'passed' AND `RemovedAt` IS NULL"
      )
      .execute();
    const teams: string[][] = await teamResult.fetchAll();
    paths.push(...teams.map(t => `/team/${t[0]}`));

    const jobResult = await session
      .sql(
        "SELECT `Uuid` FROM `Jobs` WHERE `Published` AND `RemovedAt` IS NULL"
      )
      .execute();
    const jobs: string[][] = await jobResult.fetchAll();
    paths.push(...jobs.map(j => `/job/${j[0]}`));
  } catch (err) {
    console.error(err);
  } finally {
    session.close();
  }

  return paths;
};

// Use ordinary mysql client. Our production server uses this.
const getPaths = async () => {
  const connection = mysql.createConnection({
    host: "localhost",
    port: 3307,
    user: "root",
    password: DB_PASSWORD,
    database: "milk"
  });

  connection.connect();

  let paths: string[] = [];

  try {
    const awesomeLists: string[] = await new Promise((resolve, reject) =>
      connection.query(
        "SELECT `Name`, `School` FROM `Departments`",
        (error, results) => {
          error
            ? reject(error)
            : resolve(results.map(r => `${r.School}${r.Name}`));
        }
      )
    );
    paths.push(...awesomeLists.map(listName => `/awesome/${listName}`));

    const teamUuids: string[] = await new Promise((resolve, reject) =>
      connection.query(
        "SELECT `Uuid` FROM `Teams` WHERE `CertificateVerified` = 'passed' AND `RemovedAt` IS NULL",
        (error, results) => {
          error ? reject(error) : resolve(results.map(r => r.Uuid));
        }
      )
    );
    paths.push(...teamUuids.map(uuid => `/team/${uuid}`));

    const jobUuids: string[] = await new Promise((resolve, reject) =>
      connection.query(
        "SELECT `Uuid` FROM `Jobs` WHERE `Published` AND `RemovedAt` IS NULL",
        (error, results) => {
          error ? reject(error) : resolve(results.map(r => r.Uuid));
        }
      )
    );
    paths.push(...jobUuids.map(uuid => `/job/${uuid}`));
  } catch (err) {
    console.error(err);
  } finally {
    connection.end();
  }

  return paths;
};

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

const generateSitemap = async () => {
  const root = builder
    .begin()
    .declaration({ encoding: "UTF-8" })
    .ele("urlset", {
      xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
      "xmlns:xhtml": "http://www.w3.org/1999/xhtml"
    });

  const allPaths = [...staticPaths, ...(await getPaths())];
  allPaths.forEach(path => {
    const url = urljoin("https://milk.jobs", path);
    const urlNode = generateUrlNode(url);
    root.ele(urlNode);
  });

  const xml = root.end({ pretty: true, spaceBeforeSlash: true });

  fs.writeFile("public/sitemap.xml", xml, () => {});
};

generateSitemap();
