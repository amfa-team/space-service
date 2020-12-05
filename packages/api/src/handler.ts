import { AWSLambda } from "@sentry/serverless";
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import {
  handleHello,
  handleHelloYou,
  helloYouDecoder,
} from "./hello/helloController";
import { handlePublicGET, handlePublicPOST, setup } from "./services/io/io";

setup();

export const hello = AWSLambda.wrapHandler(async function hello(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return handlePublicGET<"hello">(event, context, handleHello);
});

export const helloYou = AWSLambda.wrapHandler(async function helloYou(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return handlePublicPOST<"hello">(
    event,
    context,
    handleHelloYou,
    helloYouDecoder,
  );
});
