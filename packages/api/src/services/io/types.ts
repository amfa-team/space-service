import type {
  AdminData,
  GetRoutes,
  PostRoutes,
  WsRoutes,
} from "@amfa-team/space-service-types";
import type {
  APIGatewayEventRequestContext,
  APIGatewayProxyEventHeaders,
  APIGatewayProxyEventQueryStringParameters,
} from "aws-lambda";

export interface PublicRequest<T> {
  data: T;
}

export interface WsRequest<T> {
  data: T;
  msgId: string;
  action: string;
}

export type AdminRequest<T extends AdminData> = PublicRequest<T>;

export interface RequestContext {
  domainName?: string;
  connectionId?: string;
  stage: string;
}

export interface HandlerResult<T> {
  payload: T;
  headers?: Record<string, string>;
}

export type GetHandler<P extends keyof GetRoutes> = (
  params: APIGatewayProxyEventQueryStringParameters | null,
  headers: APIGatewayProxyEventHeaders,
  requestContext: APIGatewayEventRequestContext,
) => Promise<HandlerResult<GetRoutes[P]["out"]>>;

export type PostHandler<P extends keyof PostRoutes> = (
  data: PostRoutes[P]["in"],
  headers: APIGatewayProxyEventHeaders,
  requestContext: APIGatewayEventRequestContext,
) => Promise<HandlerResult<PostRoutes[P]["out"]>>;

export type WsHandler<P extends keyof WsRoutes> = (
  data: WsRoutes[P]["in"],
  requestContext: APIGatewayEventRequestContext & { connectionId: string },
) => Promise<HandlerResult<WsRoutes[P]["out"]>>;

export type WsDiconnectHandler = (
  requestContext: APIGatewayEventRequestContext & { connectionId: string },
) => Promise<null>;
