import type {
  AdminData,
  GetRoutes,
  PostRoutes,
} from "@amfa-team/space-service-types";
import type { APIGatewayEventRequestContext } from "aws-lambda";

export interface PublicRequest<T> {
  data: T;
}

export type AdminRequest<T extends AdminData> = PublicRequest<T>;

export interface RequestContext {
  domainName?: string;
  stage: string;
}

export interface HandlerResult<T> {
  payload: T;
  headers?: Record<string, string>;
}

export type GetHandler<P extends keyof GetRoutes> = (
  params: Record<string, string> | null,
  headers: Record<string, string>,
  requestContext: APIGatewayEventRequestContext,
) => Promise<HandlerResult<GetRoutes[P]["out"]>>;

export type PostHandler<P extends keyof PostRoutes> = (
  data: PostRoutes[P]["in"],
  headers: Record<string, string>,
  requestContext: APIGatewayEventRequestContext,
) => Promise<HandlerResult<PostRoutes[P]["out"]>>;
