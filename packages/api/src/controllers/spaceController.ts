import type { SpacesPayload } from "@amfa-team/space-service-types";
import { SpaceModel } from "../mongo/model/space";
import type { HandlerResult } from "../services/io/types";

export async function handleList(): Promise<HandlerResult<SpacesPayload>> {
  const spaces = await SpaceModel.find({ enabled: true });
  return {
    payload: {
      spaces: spaces.map((s) => s.toJSON()),
    },
  };
}
