import type {
  AdminData,
  AdminGetRoutes,
  AdminPostRoutes,
  PublicGetRoutes,
  PublicPostRoutes,
  WsRoutes,
  WsServerEvents,
} from "@amfa-team/space-service-types";
import { RewriteFrames } from "@sentry/integrations";
import { flush, init as initSentry } from "@sentry/serverless";
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { ApiGatewayManagementApi } from "aws-sdk";
import { JsonDecoder } from "ts.data.json";
import { close, connect } from "../../mongo/client";
import { getEnv } from "../../utils/env";
import { ForbiddenError, InvalidRequestError } from "./exceptions";
import { logger } from "./logger";
import type {
  AdminRequest,
  GetHandler,
  HandlerResult,
  PostHandler,
  PublicRequest,
  WsDiconnectHandler,
  WsHandler,
  WsRequest,
} from "./types";

const DOMAIN_NAME = process.env.WEBSOCKET_DOMAIN ?? "";

const apigwManagementApi: ApiGatewayManagementApi = new ApiGatewayManagementApi(
  process.env.IS_OFFLINE
    ? { apiVersion: "2018-11-29", endpoint: `http://localhost:3001` }
    : { apiVersion: "2018-11-29", endpoint: `${DOMAIN_NAME}` },
);

function getCorsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,PATCH",
    "Access-Control-Allow-Headers":
      "Content-Type,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent,X-User-Id",
    "Access-Control-Allow-Origin": "*",
  };
}

export function setup() {
  // https://botondveress.com/blog/sentry-sourcemaps-aws-lambda-functions
  initSentry({
    dsn: process.env.SENTRY_DNS,
    environment: process.env.SENTRY_ENVIRONMENT,
    enabled: !process.env.IS_OFFLINE,
    frameContextLines: 0,
    integrations: [new RewriteFrames()],
  });
}

export async function init(context: Context | null) {
  if (!process.env.IS_OFFLINE) {
    logger.info("io.init: will");
  }

  await connect(context);

  if (!process.env.IS_OFFLINE) {
    logger.info("io.init: did");
  }
}

export async function teardown(context: Context | null) {
  logger.info("io.teardown: will");
  close(context);
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
  jsonParse: boolean,
): PublicRequest<T> {
  const rawBody = event.body;
  if (!process.env.IS_OFFLINE) {
    logger.info("io.parseHttpPublicRequest: will", { rawBody, jsonParse });
  }
  const body = jsonParse ? parse(rawBody) : rawBody;
  const data = decode(body, decoder);
  if (!process.env.IS_OFFLINE) {
    logger.info("io.parseHttpPublicRequest: did", {
      rawBody,
      data,
      body,
      jsonParse,
    });
  }
  return { data };
}

export function parseWsPublicRequest<T>(
  event: APIGatewayProxyEvent,
  decoder: JsonDecoder.Decoder<T>,
): WsRequest<T> {
  const rawBody = event.body;
  if (!process.env.IS_OFFLINE) {
    logger.info("io.parseWsPublicRequest: will", { rawBody });
  }
  const body = parse(rawBody);
  const bodyDecoder = JsonDecoder.object(
    {
      msgId: JsonDecoder.string,
      action: JsonDecoder.string,
      data: decoder,
    },
    "bodyDecoder",
  );
  const { data, msgId, action } = decode(body, bodyDecoder);
  if (!process.env.IS_OFFLINE) {
    logger.info("io.parseHttpPublicRequest: did", {
      rawBody,
      data,
      msgId,
      action,
      body,
    });
  }
  return { data, msgId, action };
}

export function parseHttpAdminRequest<T extends AdminData>(
  event: APIGatewayProxyEvent,
  decoder: JsonDecoder.Decoder<T>,
): AdminRequest<T> {
  const body = parse(event.body);
  const req = { data: decode(body, decoder) };

  if (req.data.secret !== getEnv("API_SECRET")) {
    throw new ForbiddenError();
  }

  return req;
}

export async function handleHttpErrorResponse(
  e: unknown,
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  if (e instanceof InvalidRequestError) {
    logger.error(e, "handleHttpErrorResponse: invalid request", { event });

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
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,PATCH",
      "Access-Control-Allow-Headers":
        "Content-Type,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent,X-User-Id",
    },
    body: JSON.stringify({
      success: false,
      error: "Unexpected Server error",
    }),
  };
}

export function handleSuccessResponse<T>(
  data: HandlerResult<T>,
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

export function handleWsSuccessResponse<T>(
  msgId: string,
  data: HandlerResult<T>,
): APIGatewayProxyResult {
  return {
    statusCode: 200,
    headers: data.headers,
    body: JSON.stringify({
      success: true,
      msgId,
      type: "response",
      payload: data.payload,
    }),
  };
}

export function handleWsErrorResponse(
  e: unknown,
  msgId: string,
  event: APIGatewayProxyEvent,
): APIGatewayProxyResult {
  if (e instanceof InvalidRequestError) {
    return {
      statusCode: e.code,
      headers: { ...getCorsHeaders() },
      body: JSON.stringify({
        msgId,
        type: "response",
        success: false,
        error: e.message,
      }),
    };
  }

  logger.error(e, "handleHttpErrorResponse", { event });

  return {
    statusCode: 500,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,PATCH",
      "Access-Control-Allow-Headers":
        "Content-Type,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent,X-User-Id",
    },
    body: JSON.stringify({
      success: false,
      error: "Unexpected Server error",
    }),
  };
}

export async function handlePublicGET<P extends keyof PublicGetRoutes>(
  event: APIGatewayProxyEvent,
  context: Context,
  handler: GetHandler<P>,
): Promise<APIGatewayProxyResult> {
  try {
    await init(context);
    const payload = await handler(
      event.queryStringParameters,
      event.headers,
      event.requestContext,
    );
    return handleSuccessResponse(payload);
  } catch (e) {
    return handleHttpErrorResponse(e, event);
  }
}

export async function handlePublicPOST<P extends keyof PublicPostRoutes>(
  event: APIGatewayProxyEvent,
  context: Context,
  handler: PostHandler<P>,
  decoder: JsonDecoder.Decoder<PublicPostRoutes[P]["in"]>,
  jsonParse: boolean = true,
): Promise<APIGatewayProxyResult> {
  try {
    if (!process.env.IS_OFFLINE) {
      logger.info("io.handlePublicPOST: will", { event });
    }

    await init(context);

    const { data } = await parseHttpPublicRequest(event, decoder, jsonParse);
    const result = await handler(data, event.headers, event.requestContext);
    const response = await handleSuccessResponse(result);

    if (!process.env.IS_OFFLINE) {
      logger.info("io.handlePublicPOST: did");
    }
    return response;
  } catch (e) {
    logger.error(e, "io.handlePublicPOST: fail");
    return handleHttpErrorResponse(e, event);
  }
}

export async function handleAdminGET<P extends keyof AdminGetRoutes>(
  event: APIGatewayProxyEvent,
  context: Context,
  handler: GetHandler<P>,
): Promise<APIGatewayProxyResult> {
  try {
    await init(context);

    if (event.headers["x-api-secret"] !== getEnv("API_SECRET")) {
      throw new ForbiddenError();
    }

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

export async function handleAdminPOST<P extends keyof AdminPostRoutes>(
  event: APIGatewayProxyEvent,
  context: Context,
  handler: PostHandler<P>,
  decoder: JsonDecoder.Decoder<AdminPostRoutes[P]["in"]>,
): Promise<APIGatewayProxyResult> {
  try {
    await init(context);
    const { data } = await parseHttpAdminRequest(event, decoder);
    const result = await handler(data, event.headers, event.requestContext);
    return handleSuccessResponse(result);
  } catch (e) {
    return handleHttpErrorResponse(e, event);
  }
}

export async function postToConnection(
  connectionId: string | void | null,
  payload: WsServerEvents | string,
): Promise<void> {
  if (!connectionId) {
    return;
  }

  try {
    await apigwManagementApi
      .postToConnection({
        ConnectionId: connectionId,
        Data:
          typeof payload === "string"
            ? payload
            : JSON.stringify({ type: "event", payload }),
      })
      .promise();
  } catch (e) {
    // 410 Gone error
    // https://medium.com/@lancers/websocket-api-what-does-it-mean-that-disconnect-is-a-best-effort-event-317b7021456f
    if (typeof e === "object" && e?.statusCode === 410) {
      console.warn("io.postToConnection: client gone", connectionId);
    } else {
      throw e;
    }
  }
}

export async function handlePublicWs<P extends keyof WsRoutes>(
  event: APIGatewayProxyEvent,
  context: Context,
  handler: WsHandler<P>,
  decoder: JsonDecoder.Decoder<WsRoutes[P]["in"]>,
): Promise<APIGatewayProxyResult> {
  let msgId = "";

  try {
    if (!process.env.IS_OFFLINE) {
      logger.info("io.handlePublicWs: will", { event });
    }

    const { connectionId } = event.requestContext;
    if (!connectionId) {
      throw new Error("Missing connectionId");
    }

    await init(context);

    const body = await parseWsPublicRequest(event, decoder);
    msgId = body.msgId;
    const result = await handler(body.data, {
      ...event.requestContext,
      connectionId,
    });
    const response = await handleWsSuccessResponse(msgId, result);

    if (!process.env.IS_OFFLINE) {
      logger.info("io.handlePublicWs: did");
    }

    // Lambda response is sent through WebSocket in Api Gateway but not in serverless offline
    // https://github.com/dherault/serverless-offline/issues/1008
    if (process.env.IS_OFFLINE) {
      await postToConnection(event.requestContext.connectionId, response.body);
    }

    return response;
  } catch (e) {
    logger.error(e, "io.handlePublicWs: fail");
    const response = await handleWsErrorResponse(e, msgId, event);

    // Lambda response is sent through WebSocket in Api Gateway but not in serverless offline
    // https://github.com/dherault/serverless-offline/issues/1008
    if (process.env.IS_OFFLINE) {
      await postToConnection(event.requestContext.connectionId, response.body);
    }

    return response;
  }
}

export async function handlePublicWsDisconnect(
  event: APIGatewayProxyEvent,
  context: Context,
  handler: WsDiconnectHandler,
): Promise<APIGatewayProxyResult> {
  try {
    if (!process.env.IS_OFFLINE) {
      logger.info("io.handlePublicWsDisconnect: will", { event });
    }

    const { connectionId } = event.requestContext;
    if (!connectionId) {
      throw new Error("Missing connectionId");
    }

    await init(context);

    await handler({
      ...event.requestContext,
      connectionId,
    });

    if (!process.env.IS_OFFLINE) {
      logger.info("io.handlePublicWs: did");
    }
  } catch (e) {
    logger.error(e, "io.handlePublicWs: fail");
  }

  return {
    statusCode: 200,
    body: "",
  };
}
