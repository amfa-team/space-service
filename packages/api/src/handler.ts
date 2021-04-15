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
  getQuorumReqDecoder,
  handleGetQuorum,
  handleListQuorum,
  handlePollList,
  handlePollResult,
  handlePollVoteGet,
  handleSubmitVote,
  listQuorumReqDecoder,
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
  handleWsConnection,
  handleWsDiconnection,
  wsConnectionDecoder,
} from "./controllers/wsController";
import { NotFoundError } from "./services/io/exceptions";
import {
  handleAdminPOST,
  handleHttpErrorResponse,
  handlePublicGET,
  handlePublicPOST,
  handlePublicWs,
  handlePublicWsDisconnect,
  handleWsErrorResponse,
  setup,
} from "./services/io/io";

setup();

export const handler = AWSLambda.wrapHandler(async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  if (event.requestContext.eventType === "MESSAGE") {
    switch (event.requestContext.routeKey) {
      case "/connect":
        return handlePublicWs(
          event,
          context,
          handleWsConnection,
          wsConnectionDecoder,
        );
      default:
        return handleWsErrorResponse(new NotFoundError(), "", event);
    }
  }

  if (event.requestContext.eventType === "DISCONNECT") {
    return handlePublicWsDisconnect(event, context, handleWsDiconnection);
  }

  switch (event.path) {
    case "/get":
      return handlePublicPOST<"get">(
        event,
        context,
        handleGet,
        handleGetDecoder,
      );
    case "/list":
      return handlePublicGET<"list">(event, context, handleList);
    case "/polls/list":
      return handlePublicPOST<"polls/list">(
        event,
        context,
        handlePollList,
        pollListReqDecoder,
      );
    case "/polls/vote/get":
      return handlePublicPOST<"polls/vote/get">(
        event,
        context,
        handlePollVoteGet,
        pollVoteGetReqDecoder,
      );
    case "/polls/vote/submit":
      return handlePublicPOST<"polls/vote/submit">(
        event,
        context,
        handleSubmitVote,
        submitVoteReqDecoder,
      );
    case "/polls/result":
      return handlePublicPOST<"polls/result">(
        event,
        context,
        handlePollResult,
        pollVoteGetReqDecoder,
      );
    case "/quorum/get":
      return handlePublicPOST<"quorum/get">(
        event,
        context,
        handleGetQuorum,
        getQuorumReqDecoder,
      );
    case "/quorum/list":
      return handlePublicPOST<"quorum/list">(
        event,
        context,
        handleListQuorum,
        listQuorumReqDecoder,
      );
    case "/admin/image/upload":
      return handleAdminPOST<"admin/image/upload">(
        event,
        context,
        handleAdminImageUpload,
        adminImageUploadDecoder,
      );
    case "/admin/space":
      return handleAdminPOST<"admin/space">(
        event,
        context,
        handleAdminSpaces,
        adminListDecoder,
      );
    case "/admin/space/update":
      return handleAdminPOST<"admin/space/update">(
        event,
        context,
        handleAdminSpaceUpdate,
        adminSpaceUpdateDecoder,
      );
    case "/admin/space/remove":
      return handleAdminPOST<"admin/space/remove">(
        event,
        context,
        handleAdminSpaceRemove,
        adminSpaceRemoveDecoder,
      );
    case "/admin/poll/create":
      return handleAdminPOST<"admin/poll/create">(
        event,
        context,
        handleAdminPollCreate,
        adminPollCreateDecoder,
      );
    case "/admin/poll/update":
      return handleAdminPOST<"admin/poll/update">(
        event,
        context,
        handleAdminPollUpdate,
        adminPollUpdateDecoder,
      );
    case "/admin/poll/remove":
      return handleAdminPOST<"admin/poll/remove">(
        event,
        context,
        handleAdminPollRemove,
        adminPollRemoveDecoder,
      );
    case "/admin/voter/create":
      return handleAdminPOST<"admin/voter/create">(
        event,
        context,
        handleAdminVoterCreate,
        adminVoterCreateDecoder,
      );
    case "/admin/voter/update":
      return handleAdminPOST<"admin/voter/update">(
        event,
        context,
        handleAdminVoterUpdate,
        adminVoterUpdateDecoder,
      );
    case "/admin/voter/remove":
      return handleAdminPOST<"admin/voter/remove">(
        event,
        context,
        handleAdminVoterRemove,
        adminVoterRemoveDecoder,
      );
    default:
      return handleHttpErrorResponse(new NotFoundError(), event);
  }
});
