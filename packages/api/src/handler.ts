import { AWSLambda } from "@sentry/serverless";
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { handleList } from "./controllers/spaceController";
import { handlePublicGET, setup } from "./services/io/io";

setup();

export const list = AWSLambda.wrapHandler(async function hello(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return handlePublicGET<"list">(event, context, handleList);
});
