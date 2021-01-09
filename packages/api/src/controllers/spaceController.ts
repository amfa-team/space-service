import type {
  GetSpacePayload,
  GetSpaceReq,
  SpacesPayload,
} from "@amfa-team/space-service-types";
import {
  canAccessSpace,
  parseOptionalUserServiceToken,
} from "@amfa-team/user-service-node";
import { JsonDecoder } from "ts.data.json";
import { SpaceModel } from "../mongo/model/space";
import type { HandlerResult } from "../services/io/types";

export async function handleList(): Promise<HandlerResult<SpacesPayload>> {
  const spaces = await SpaceModel.find({ enabled: true, home: true }, null, {
    sort: {
      enabled: 1,
      home: 1,
      order: 1,
    },
  });
  return {
    payload: {
      spaces: spaces.map((s) => s.toJSON()),
    },
  };
}

export const handleGetDecoder = JsonDecoder.object(
  {
    slug: JsonDecoder.string,
    token: JsonDecoder.nullable(JsonDecoder.string),
  },
  "GetSpaceReq",
);

export async function handleGet(
  data: GetSpaceReq,
): Promise<HandlerResult<GetSpacePayload>> {
  const space = await SpaceModel.findById(data.slug);
  const userData = parseOptionalUserServiceToken(data.token);

  if (space?.random === true) {
    const query = { enabled: true, home: true, random: false, public: true };
    const count = await SpaceModel.countDocuments(query);

    const random = Math.floor(Math.random() * count);
    const randomSpace = await SpaceModel.findOne(query, null, { skip: random });

    return {
      payload: {
        space: randomSpace,
        private: !randomSpace?.public,
      },
    };
  }

  const isPublic = space?.public ?? true;

  return {
    payload: {
      space: isPublic || canAccessSpace(userData, data.slug) ? space : null,
      private: !isPublic,
    },
  };
}
