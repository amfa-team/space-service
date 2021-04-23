import type {
  AdminVoterCreateReq,
  AdminVoterRemoveReq,
  AdminVoterUpdateReq,
  IVoter,
} from "@amfa-team/space-service-types";
import { JsonDecoder } from "ts.data.json";
import { getSpaceModel } from "../../mongo/model/space";
import { getVoterModel } from "../../mongo/model/voter";
import type { HandlerResult } from "../../services/io/types";

export const adminVoterCreateDecoder = JsonDecoder.object<AdminVoterCreateReq>(
  {
    voter: JsonDecoder.object(
      {
        email: JsonDecoder.string,
        spaceSlug: JsonDecoder.string,
        count: JsonDecoder.number,
      },
      "voter",
    ),
    secret: JsonDecoder.string,
  },
  "adminVoterCreateDecoder",
);

export const adminVoterUpdateDecoder = JsonDecoder.object<AdminVoterUpdateReq>(
  {
    id: JsonDecoder.string,
    voter: JsonDecoder.object(
      {
        spaceSlug: JsonDecoder.optional(JsonDecoder.string),
        email: JsonDecoder.optional(JsonDecoder.string),
        count: JsonDecoder.optional(JsonDecoder.number),
      },
      "voter",
    ),
    secret: JsonDecoder.string,
  },
  "adminVoterUpdateDecoder",
);

export async function handleAdminVoterCreate(
  data: AdminVoterCreateReq,
): Promise<HandlerResult<IVoter>> {
  const [SpaceModel, VoterModel] = await Promise.all([
    getSpaceModel(),
    getVoterModel(),
  ]);

  const space = await SpaceModel.findById(data.voter.spaceSlug);

  if (space === null) {
    throw new Error("space not found");
  }

  const voterData: Partial<IVoter> = {
    spaceSlug: data.voter.spaceSlug,
    email: data.voter.email,
    count: data.voter.count,
  };

  const voter = new VoterModel(voterData);
  await voter.save();

  return {
    payload: voter,
  };
}

export async function handleAdminVoterUpdate(
  data: AdminVoterUpdateReq,
): Promise<HandlerResult<IVoter>> {
  const VoterModel = await getVoterModel();

  const update: Partial<IVoter> = {};
  if (data.voter.spaceSlug) {
    update.spaceSlug = data.voter.spaceSlug;
  }
  if (data.voter.email) {
    update.email = data.voter.email;
  }
  if (data.voter.count != null) {
    update.count = data.voter.count;
  }

  const voter = await VoterModel.findOneAndUpdate({ _id: data.id }, update, {
    upsert: false,
    new: true,
  });

  if (!voter) {
    throw new Error("voter not found");
  }

  return {
    payload: voter,
  };
}

export const adminVoterRemoveDecoder = JsonDecoder.object<AdminVoterRemoveReq>(
  {
    id: JsonDecoder.string,
    secret: JsonDecoder.string,
  },
  "adminVoterRemoveDecoder",
);

export async function handleAdminVoterRemove(
  data: AdminVoterRemoveReq,
): Promise<HandlerResult<null>> {
  const VoterModel = await getVoterModel();
  await VoterModel.findByIdAndRemove(data.id);

  return {
    payload: null,
  };
}
