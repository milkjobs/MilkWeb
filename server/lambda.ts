import awsServerlessExpress from "aws-serverless-express";
import app from "./app";

const binaryMimeTypes = [
  "application/javascript",
  "application/json",
  "application/octet-stream",
  "application/xml",
  "font/eot",
  "font/opentype",
  "font/otf",
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/*",
  "text/comma-separated-values",
  "text/css",
  "text/html",
  "text/javascript",
  "text/plain",
  "text/text",
  "text/xml",
];

const server = awsServerlessExpress.createServer(
  app,
  undefined,
  binaryMimeTypes
);

const main = (event, context) =>
  awsServerlessExpress.proxy(server, event, context, "PROMISE").promise;

export { main };
