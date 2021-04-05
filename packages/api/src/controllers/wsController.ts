import type {
  IConnection,
  IPoll,
  PollUpdatedWsServerEvents,
  QuorumLiveWsServerEvents,
  QuorumSavedWsServerEvents,
  VotedWsServerEvents,
  WsConnectionReq,
  WsServerEvents,
} from "@amfa-team/space-service-types";
import {
  canAccessSpace,
  canManageSpace,
  parseUserServiceToken,
} from "@amfa-team/user-service-node";
import type { APIGatewayEventRequestContext } from "aws-lambda";
import { JsonDecoder } from "ts.data.json";
import { getConnectionModel } from "../mongo/model/connection";
import { getSpaceModel } from "../mongo/model/space";
import { postToConnection } from "../services/io/io";
import type { HandlerResult } from "../services/io/types";
import { computeInstantQuorum } from "../services/quorumService";

export async function broadcastToConnections(
  spaceSlug: string,
  event: WsServerEvents,
  adminOnly: boolean = false,
) {
  const ConnectionModel = await getConnectionModel();

  const connections = await ConnectionModel.find(
    adminOnly ? { spaceSlug, canManage: true } : { spaceSlug },
  );

  await Promise.allSettled(
    connections.map(async (c) => postToConnection(c._id, event)),
  );
}

export async function onLiveQuorumUpdated(spaceSlug: string) {
  const event: QuorumLiveWsServerEvents = {
    name: "quorum/live",
    quorum: await computeInstantQuorum(spaceSlug),
  };

  await broadcastToConnections(spaceSlug, event, true);
}

export async function onQuorumSaved(spaceSlug: string) {
  const event: QuorumSavedWsServerEvents = {
    name: "quorum/saved",
  };

  await broadcastToConnections(spaceSlug, event, true);
}

export async function onVoted(poll: IPoll, email: string) {
  const ConnectionModel = await getConnectionModel();

  const voterConnections = await ConnectionModel.find({
    spaceSlug: poll.spaceSlug,
    email,
    // do not send twice the event, if admin it will be broadcasted
    canManage: false,
  });

  const event: VotedWsServerEvents = {
    name: "polls/vote",
    pollId: poll._id,
  };

  await Promise.allSettled([
    broadcastToConnections(poll.spaceSlug, event, true),
    ...voterConnections.map(async (c) => postToConnection(c._id, event)),
  ]);
}

export async function onPollsUpdated(spaceSlug: string) {
  const event: PollUpdatedWsServerEvents = {
    name: "polls/updated",
  };

  await broadcastToConnections(spaceSlug, event, false);
}

export const wsConnectionDecoder = JsonDecoder.object<WsConnectionReq>(
  {
    token: JsonDecoder.string,
    spaceId: JsonDecoder.string,
  },
  "wsConnectionDecoder",
);

export async function handleWsConnection(
  data: WsConnectionReq,
  requestContext: APIGatewayEventRequestContext & { connectionId: string },
): Promise<HandlerResult<null | IConnection>> {
  const SpaceModel = await getSpaceModel();
  const ConnectionModel = await getConnectionModel();

  const userData = parseUserServiceToken(data.token);
  const space = await SpaceModel.findById(data.spaceId);

  if (space === null || !userData.email) {
    return {
      payload: null,
    };
  }

  if (!space.public && !canAccessSpace(userData, data.spaceId)) {
    return {
      payload: null,
    };
  }

  const conn: IConnection = {
    _id: requestContext.connectionId,
    email: userData.email,
    spaceSlug: data.spaceId,
    canManage: canManageSpace(userData, data.spaceId),
  };

  await ConnectionModel.findOneAndUpdate({ _id: conn._id }, conn, {
    upsert: true,
  });

  await onLiveQuorumUpdated(data.spaceId);

  return {
    payload: conn,
  };
}

export async function handleWsDiconnection(
  requestContext: APIGatewayEventRequestContext & { connectionId: string },
): Promise<null> {
  const ConnectionModel = await getConnectionModel();

  const conn = await ConnectionModel.findOneAndDelete({
    _id: requestContext.connectionId,
  });

  if (conn?.spaceSlug) {
    await onLiveQuorumUpdated(conn.spaceSlug);
  }

  return null;
}
