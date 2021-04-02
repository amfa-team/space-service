import { AWSLambda } from "@sentry/serverless";
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { adminListDecoder } from "./controllers/admin/common";
import {
  adminPollCreateDecoder,
  adminPollRemoveDecoder,
  adminPollUpdateDecoder,
  handleAdminPollCreate,
  handleAdminPollRemove,
  handleAdminPollUpdate,
} from "./controllers/admin/pollAdminController";
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
  adminVoterCreateDecoder,
  adminVoterRemoveDecoder,
  adminVoterUpdateDecoder,
  handleAdminVoterCreate,
  handleAdminVoterRemove,
  handleAdminVoterUpdate,
} from "./controllers/admin/voterAdminController";
import {
  handlePollList,
  handlePollResult,
  handlePollVoteGet,
  handleSubmitVote,
  pollListReqDecoder,
  pollVoteGetReqDecoder,
  submitVoteReqDecoder,
} from "./controllers/pollController";
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

export const pollList: any = AWSLambda.wrapHandler(async function pollList(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return handlePublicPOST<"polls/list">(
    event,
    context,
    handlePollList,
    pollListReqDecoder,
  );
});

export const getVote: any = AWSLambda.wrapHandler(async function getVote(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return handlePublicPOST<"polls/vote/get">(
    event,
    context,
    handlePollVoteGet,
    pollVoteGetReqDecoder,
  );
});

export const submitVote: any = AWSLambda.wrapHandler(async function submitVote(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return handlePublicPOST<"polls/vote/submit">(
    event,
    context,
    handleSubmitVote,
    submitVoteReqDecoder,
  );
});

export const getPollResult: any = AWSLambda.wrapHandler(
  async function getPollResult(
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    return handlePublicPOST<"polls/result">(
      event,
      context,
      handlePollResult,
      pollVoteGetReqDecoder,
    );
  },
);

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

export const adminPollCreate: any = AWSLambda.wrapHandler(
  async function adminPollCreate(
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    return handleAdminPOST<"admin/poll/create">(
      event,
      context,
      handleAdminPollCreate,
      adminPollCreateDecoder,
    );
  },
);

export const adminPollUpdate: any = AWSLambda.wrapHandler(
  async function adminPollUpdate(
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    return handleAdminPOST<"admin/poll/update">(
      event,
      context,
      handleAdminPollUpdate,
      adminPollUpdateDecoder,
    );
  },
);

export const adminPollRemove: any = AWSLambda.wrapHandler(
  async function adminPollRemove(
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    return handleAdminPOST<"admin/poll/remove">(
      event,
      context,
      handleAdminPollRemove,
      adminPollRemoveDecoder,
    );
  },
);

export const adminVoterCreate: any = AWSLambda.wrapHandler(
  async function adminVoterCreate(
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    return handleAdminPOST<"admin/voter/create">(
      event,
      context,
      handleAdminVoterCreate,
      adminVoterCreateDecoder,
    );
  },
);

export const adminVoterUpdate: any = AWSLambda.wrapHandler(
  async function adminVoterUpdate(
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    return handleAdminPOST<"admin/voter/update">(
      event,
      context,
      handleAdminVoterUpdate,
      adminVoterUpdateDecoder,
    );
  },
);

export const adminVoterRemove: any = AWSLambda.wrapHandler(
  async function adminVoterRemove(
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    return handleAdminPOST<"admin/voter/remove">(
      event,
      context,
      handleAdminVoterRemove,
      adminVoterRemoveDecoder,
    );
  },
);
