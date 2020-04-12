import { Job, Post, Team } from "@frankyjuang/milkapi-client";
import express from "express";
import fs from "fs";
import fetch from "node-fetch";
import path from "path";
import urljoin from "url-join";

interface Metadata {
  url: string;
  title: string;
  description: string;
  image?: string;
}

const webBaseUrl =
  process.env.NODE_ENV === "production"
    ? "https://milk.jobs/"
    : "https://staging.milk.jobs/";
const apiBaseUrl =
  process.env.NODE_ENV === "production"
    ? "https://api.production.milk.jobs/"
    : "https://api.staging.milk.jobs/";
const buildDir = path.resolve(__dirname, "build");

const getBody = async ({ url, title, description, image }: Metadata) => {
  const indexPath = path.resolve(buildDir, "index.html");
  const rawBody = await new Promise<string>((resolve, reject) =>
    fs.readFile(indexPath, { encoding: "utf8" }, (err, data) => {
      err ? reject(err) : resolve(data);
    })
  );
  const body = rawBody
    .replace(/\$URL/g, urljoin(webBaseUrl, url))
    .replace(/\$TITLE/g, title)
    .replace(/\$DESCRIPTION/g, description)
    .replace(/\$IMAGE/g, image || "/cover.jpeg");

  return body;
};

const getDefaultBody = (url: string) =>
  getBody({
    url,
    title: "牛奶找工作，大學生的求職平台：工作，是為了更好的生活",
    description:
      "牛奶找工作，專注於大學生、新鮮人的求職機會。我們的 App 提供最快速、直接的求職求才服務。求職者與公司直接聊、加快面試、即時反饋，隨時隨地都能掌握人才的訊息。"
  });

const app = express();

app.use(
  express.static(buildDir, {
    dotfiles: "allow",
    setHeaders: (res, path) => {
      if (path.endsWith("apple-app-site-association")) {
        // Set content type of AASA to json
        // https://developer.apple.com/library/archive/documentation/General/Conceptual/AppSearch/UniversalLinks.html
        res.type("application/json");
      }
    }
  })
);

app.get("/circle/:id", async (request, response) => {
  let body: string;

  try {
    const postId = request.params.id;
    const url = urljoin(apiBaseUrl, "posts", postId);
    const res = await fetch(url);
    const post: Post = await res.json();
    body = await getBody({
      url: request.url,
      title: post.text.split("\n")[0],
      description: post.text,
      image: post.imageUrls && post.imageUrls[0]
    });
  } catch {
    body = await getDefaultBody(request.url);
  }

  response.send(body);
});

app.get("/job/:id", async (request, response) => {
  let body: string;

  try {
    const jobId = request.params.id;
    const url = urljoin(apiBaseUrl, "jobs", jobId, "anonymous");
    const res = await fetch(url);
    const job: Job = await res.json();
    const teamName = job.team ? `・${job.team.nickname}` : "";
    body = await getBody({
      url: request.url,
      title: `${job.name}${teamName}－牛奶找工作`,
      description: job.description || "尚無詳情",
      image: job.team?.logoUrl
    });
  } catch {
    body = await getDefaultBody(request.url);
  }

  response.send(body);
});

app.get("/team/:id", async (request, response) => {
  let body: string;

  try {
    const teamId = request.params.id;
    const url = urljoin(apiBaseUrl, "teams", teamId);
    const res = await fetch(url);
    const team: Team = await res.json();
    body = await getBody({
      url: request.url,
      title: `${team.nickname}－牛奶找工作`,
      description: team.introduction || "尚無介紹",
      image: team.logoUrl
    });
  } catch {
    body = await getDefaultBody(request.url);
  }

  response.send(body);
});

app.get("/awesome/:name", async (request, response) => {
  let body: string;

  try {
    const name = request.params.name;
    body = await getBody({
      url: request.url,
      title: `${name}－牛奶找工作`,
      description: `為了幫助學生更了解自己有哪些選擇，我們整理了${name}畢業生最常去的公司。先從這些公司開始應徵吧！`
    });
  } catch {
    body = await getDefaultBody(request.url);
  }

  response.send(body);
});

app.get("*", async (request, response) => {
  const body = await getDefaultBody(request.url);
  response.send(body);
});

export default app;
