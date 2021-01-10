import { AWSLambda } from "@sentry/serverless";
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { adminListDecoder } from "./controllers/admin/common";
import {
  adminImageUploadDecoder,
  adminSpaceRemoveDecoder,
  adminSpaceUpdateDecoder,
  handleAdminImageUpload,
  handleAdminSpaceRemove,
  handleAdminSpaceUpdate,
  handleAdminSpaces,
} from "./controllers/admin/spaceAdminController";
import {
  handleGet,
  handleGetDecoder,
  handleList,
} from "./controllers/spaceController";
import {
  handleAdminPOST,
  handlePublicGET,
  handlePublicPOST,
  setup,
} from "./services/io/io";

setup();

export const getSpace: any = AWSLambda.wrapHandler(async function list(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return handlePublicPOST<"get">(event, context, handleGet, handleGetDecoder);
});

export const list: any = AWSLambda.wrapHandler(async function list(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return handlePublicGET<"list">(event, context, handleList);
});

export const adminImageUpload: any = AWSLambda.wrapHandler(
  async function adminImageUpload(
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    return handleAdminPOST<"admin/image/upload">(
      event,
      context,
      handleAdminImageUpload,
      adminImageUploadDecoder,
    );
  },
);

export const adminSpaceList: any = AWSLambda.wrapHandler(
  async function adminSpaceList(
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    return handleAdminPOST<"admin/space">(
      event,
      context,
      handleAdminSpaces,
      adminListDecoder,
    );
  },
);

export const adminSpaceUpdate: any = AWSLambda.wrapHandler(
  async function adminSpaceUpdate(
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    return handleAdminPOST<"admin/space/update">(
      event,
      context,
      handleAdminSpaceUpdate,
      adminSpaceUpdateDecoder,
    );
  },
);

export const adminSpaceRemove: any = AWSLambda.wrapHandler(
  async function adminSpaceRemove(
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    return handleAdminPOST<"admin/space/remove">(
      event,
      context,
      handleAdminSpaceRemove,
      adminSpaceRemoveDecoder,
    );
  },
);
