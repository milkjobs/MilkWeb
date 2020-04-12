import lambda from "aws-lambda";
import awsServerlessExpress from "aws-serverless-express";
import app from "./app";

const server = awsServerlessExpress.createServer(app);

export async function main(
  event: lambda.APIGatewayProxyEvent,
  context: lambda.Context
) {
  awsServerlessExpress.proxy(server, event, context);
}
