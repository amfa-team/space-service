import { AWSLambda } from "@sentry/serverless";
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { adminListDecoder } from "./controllers/admin/common";
import {
  adminPermissionRemoveDecoder,
  adminPermissionUpdateDecoder,
  handleAdminPermissionList,
  handleAdminPermissionRemove,
  handleAdminPermissionUpdate,
} from "./controllers/admin/permissionAdminController";
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

export const getSpace = AWSLambda.wrapHandler(async function list(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return handlePublicPOST<"get">(event, context, handleGet, handleGetDecoder);
});

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

export const adminSpaceRemove = AWSLambda.wrapHandler(
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

export const adminPermissionList = AWSLambda.wrapHandler(
  async function adminPermissionList(
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    return handleAdminPOST<"admin/permission">(
      event,
      context,
      handleAdminPermissionList,
      adminListDecoder,
    );
  },
);

export const adminPermissionUpdate = AWSLambda.wrapHandler(
  async function adminPermissionUpdate(
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    return handleAdminPOST<"admin/permission/update">(
      event,
      context,
      handleAdminPermissionUpdate,
      adminPermissionUpdateDecoder,
    );
  },
);

export const adminPermissionRemove = AWSLambda.wrapHandler(
  async function adminPermissionRemove(
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    return handleAdminPOST<"admin/permission/remove">(
      event,
      context,
      handleAdminPermissionRemove,
      adminPermissionRemoveDecoder,
    );
  },
);
