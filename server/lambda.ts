import awsServerlessExpress from "aws-serverless-express";
import app from "./app";

const server = awsServerlessExpress.createServer(app);

const main = (event, context) =>
  awsServerlessExpress.proxy(server, event, context, "PROMISE").promise;

export { main };
