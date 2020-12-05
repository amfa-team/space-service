import type { GetRoutes, PostRoutes } from "@amfa-team/hello-service-types";
import { flush, init as initSentry } from "@sentry/serverless";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import type { JsonDecoder } from "ts.data.json";
import { InvalidRequestError } from "./exceptions";
import { logger } from "./logger";
import type {
  GetHandler,
  HandlerResult,
  PostHandler,
  PublicRequest,
} from "./types";

function getCorsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,PATCH",
    "Access-Control-Allow-Headers":
      "Content-Type,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent,X-User-Id",
    "Access-Control-Allow-Origin": "*",
  };
}

export function setup() {
  initSentry({
    dsn: process.env.SENTRY_DNS,
    environment: process.env.SENTRY_ENVIRONMENT,
    enabled: !process.env.IS_OFFLINE,
  });
}

export async function teardown() {
  logger.info("io.teardown: will");
  await flush(2000);
  logger.info("io.teardown: did");
}

export function parse(body: string | null): unknown {
  try {
    return body === null ? body : JSON.parse(body);
  } catch (e) {
    throw new InvalidRequestError(`Unable to parse body: ${e.message}`);
  }
}

function decode<T>(data: unknown, decoder: JsonDecoder.Decoder<T>): T {
  const result = decoder.decode(data);

  if (!result.isOk()) {
    throw new InvalidRequestError(result.error);
  }

  return result.value;
}

export function parseHttpPublicRequest<T>(
  event: APIGatewayProxyEvent,
  decoder: JsonDecoder.Decoder<T>,
): PublicRequest<T> {
  const body = parse(event.body);
  return { data: decode(body, decoder) };
}

export async function handleHttpErrorResponse(
  e: unknown,
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  if (e instanceof InvalidRequestError) {
    return {
      statusCode: e.code,
      headers: { ...getCorsHeaders() },
      body: JSON.stringify({
        success: false,
        error: e.message,
      }),
    };
  }

  logger.error(e, "handleHttpErrorResponse", { event });

  return {
    statusCode: 500,
    headers: { ...getCorsHeaders() },
    body: JSON.stringify({
      success: false,
      error: "Unexpected Server error",
    }),
  };
}

export function handleSuccessResponse(
  data: HandlerResult<unknown>,
): APIGatewayProxyResult {
  return {
    statusCode: 200,
    headers: {
      ...getCorsHeaders(),
      ...data.headers,
    },
    body: JSON.stringify({
      success: true,
      payload: data.payload,
    }),
  };
}

export async function handlePublicGET<P extends keyof GetRoutes>(
  event: APIGatewayProxyEvent,
  handler: GetHandler<P>,
): Promise<APIGatewayProxyResult> {
  try {
    const result = await handler(
      event.queryStringParameters,
      event.headers,
      event.requestContext,
    );
    return handleSuccessResponse(result);
  } catch (e) {
    return handleHttpErrorResponse(e, event);
  }
}

export async function handlePublicPOST<P extends keyof PostRoutes>(
  event: APIGatewayProxyEvent,
  handler: PostHandler<P>,
  decoder: JsonDecoder.Decoder<PostRoutes[P]["in"]>,
): Promise<APIGatewayProxyResult> {
  try {
    const { data } = await parseHttpPublicRequest(event, decoder);
    const result = await handler(data, event.headers, event.requestContext);
    return handleSuccessResponse(result);
  } catch (e) {
    return handleHttpErrorResponse(e, event);
  }
}
