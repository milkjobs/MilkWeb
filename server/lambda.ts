import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler
} from "aws-lambda";
import awsServerlessExpress from "aws-serverless-express";
import app from "./app";

const server = awsServerlessExpress.createServer(app);

const main: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = (
  event,
  context,
  callback
) => {
  awsServerlessExpress.proxy(server, event, context, "CALLBACK", callback);
};

export { main };
