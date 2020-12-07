import type {
  GetSpaceReq,
  ISpace,
  SpacesPayload,
} from "@amfa-team/space-service-types";
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
  },
  "GetSpaceReq",
);

export async function handleGet(
  data: GetSpaceReq,
): Promise<HandlerResult<ISpace | null>> {
  const space = await SpaceModel.findById(data.slug);

  if (space !== null && !space.random) {
    return {
      payload: space,
    };
  }

  const query = { enabled: true, home: true, random: false };
  const count = await SpaceModel.countDocuments(query);

  const random = Math.floor(Math.random() * count);
  const randomSpace = await SpaceModel.findOne(query, null, { skip: random });

  return {
    payload: randomSpace,
  };
}
