const express = require("express");
const fs = require("fs");
const fetch = require("node-fetch");

const app = express();
const port = process.env.PORT || 5000;
const path = require("path");
const urljoin = require("url-join");

app.get("/circle/:id", function(request, response) {
  fetch(urljoin("https://api.production.milk.jobs/posts/", request.params.id))
    .then((res) => res.text())
    .then((body) => {
      const filePath = path.resolve(__dirname, "./build", "index.html");
      fs.readFile(filePath, "utf8", function(err, data) {
        if (err) {
          return console.log(err);
        }
        try {
          const circle = JSON.parse(body);
          data = data.replace(/\$OG_TITLE/g, circle.text.split("\n")[0]);
          data = data.replace(/\$OG_DESCRIPTION/g, circle.text);
          result = data.replace(
            /\$OG_IMAGE/g,
            circle.imageUrls.length > 0 ? circle.imageUrls[0] : "/cover.jpeg"
          );
          response.send(result);
        } catch {
          response.send(data);
        }
      });
    })
    .catch(() => {
      const filePath = path.resolve(__dirname, "./build", "index.html");
      response.sendFile(filePath);
    });
});

app.get("/job/:id", function(request, response) {
  fetch(
    urljoin(
      "https://api.production.milk.jobs/jobs/",
      request.params.id,
      "anonymous"
    )
  )
    .then((res) => res.text())
    .then((body) => {
      const filePath = path.resolve(__dirname, "./build", "index.html");
      fs.readFile(filePath, "utf8", function(err, data) {
        if (err) {
          return console.log(err);
        }
        try {
          const job = JSON.parse(body);
          data = data.replace(
            /\$OG_TITLE/g,
            job.name + " - " + job.team.nickname
          );
          data = data.replace(/\$OG_DESCRIPTION/g, job.description);
          result = data.replace(/\$OG_IMAGE/g, job.team.logoUrl);
          response.send(result);
        } catch {
          response.send(data);
        }
      });
    })
    .catch(() => {
      const filePath = path.resolve(__dirname, "./build", "index.html");
      response.sendFile(filePath);
    });
});
app.get("/", function(request, response) {
  const filePath = path.resolve(__dirname, "./build", "index.html");
  fs.readFile(filePath, "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }
    data = data.replace(
      /\$OG_TITLE/g,
      "牛奶找工作，大學生的求職平台：工作，是為了更好的生活"
    );
    data = data.replace(
      /\$OG_DESCRIPTION/g,
      "牛奶找工作，專注於大學生、新鮮人的求職機會。我們的 App 提供最快速、直接的求職求才服務。求職者與公司直接聊、加快面試、即時反饋，隨時隨地都能掌握人才的訊息。"
    );
    result = data.replace(/\$OG_IMAGE/g, "/cover.jpeg");
    response.send(result);
  });
});

app.use(express.static(path.resolve(__dirname, "./build")));

app.get("*", function(request, response) {
  const filePath = path.resolve(__dirname, "./build", "index.html");
  fs.readFile(filePath, "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }
    data = data.replace(
      /\$OG_TITLE/g,
      "牛奶找工作，大學生的求職平台：工作，是為了更好的生活"
    );
    data = data.replace(
      /\$OG_DESCRIPTION/g,
      "牛奶找工作，專注於大學生、新鮮人的求職機會。我們的 App 提供最快速、直接的求職求才服務。求職者與公司直接聊、加快面試、即時反饋，隨時隨地都能掌握人才的訊息。"
    );
    result = data.replace(/\$OG_IMAGE/g, "/cover.jpeg");
    response.send(result);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
