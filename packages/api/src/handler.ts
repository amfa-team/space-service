import { AWSLambda } from "@sentry/serverless";
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import {
  adminImageUploadDecoder,
  adminListDecoder,
  adminSpaceUpdateDecoder,
  handleAdminImageUpload,
  handleAdminSpaceUpdate,
  handleAdminSpaces,
} from "./controllers/adminController";
import { handleList } from "./controllers/spaceController";
import { handleAdminPOST, handlePublicGET, setup } from "./services/io/io";

setup();

export const list = AWSLambda.wrapHandler(async function list(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return handlePublicGET<"list">(event, context, handleList);
});

export const adminImageUpload = AWSLambda.wrapHandler(
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

export const adminSpaceList = AWSLambda.wrapHandler(
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

export const adminSpaceUpdate = AWSLambda.wrapHandler(
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
