import type {
  AdminPollCreateReq,
  AdminPollRemoveReq,
  AdminPollUpdateReq,
  IPoll,
} from "@amfa-team/space-service-types";
import { JsonDecoder } from "ts.data.json";
import { getPollModel } from "../../mongo/model/poll";
import { getSpaceModel } from "../../mongo/model/space";
import type { HandlerResult } from "../../services/io/types";
import { onPollsUpdated } from "../wsController";

export const adminPollCreateDecoder = JsonDecoder.object<AdminPollCreateReq>(
  {
    poll: JsonDecoder.object(
      {
        question: JsonDecoder.string,
        choices: JsonDecoder.array(JsonDecoder.string, "choices"),
        spaceSlug: JsonDecoder.string,
      },
      "poll",
    ),
    secret: JsonDecoder.string,
  },
  "adminPollCreateDecoder",
);

export const adminPollUpdateDecoder = JsonDecoder.object<AdminPollUpdateReq>(
  {
    id: JsonDecoder.string,
    poll: JsonDecoder.object(
      {
        question: JsonDecoder.optional(JsonDecoder.string),
        choices: JsonDecoder.optional(
          JsonDecoder.array(JsonDecoder.string, "choices"),
        ),
        status: JsonDecoder.optional(
          JsonDecoder.oneOf(
            [
              JsonDecoder.isExactly("created"),
              JsonDecoder.isExactly("started"),
              JsonDecoder.isExactly("ended"),
              JsonDecoder.isExactly("canceled"),
            ],
            "status",
          ),
        ),
      },
      "poll",
    ),
    secret: JsonDecoder.string,
  },
  "adminPollUpdateDecoder",
);

export async function handleAdminPollCreate(
  data: AdminPollCreateReq,
): Promise<HandlerResult<IPoll>> {
  const [SpaceModel, PollModel] = await Promise.all([
    getSpaceModel(),
    getPollModel(),
  ]);

  const space = await SpaceModel.findById(data.poll.spaceSlug);

  if (space === null) {
    throw new Error("space not found");
  }

  const pollData: Partial<IPoll> = {
    spaceSlug: data.poll.spaceSlug,
    question: data.poll.question,
    choices: data.poll.choices,
    status: "created",
    events: [{ name: "created", at: new Date() }],
  };

  const poll = new PollModel(pollData);
  await poll.save();
  await onPollsUpdated(poll.spaceSlug);

  return {
    payload: poll,
  };
}

export async function handleAdminPollUpdate(
  data: AdminPollUpdateReq,
): Promise<HandlerResult<IPoll>> {
  const PollModel = await getPollModel();

  const update: Partial<IPoll> = Object.keys(data.poll).reduce((acc, key) => {
    // @ts-ignore
    if (data.poll[key] != null) {
      // @ts-ignore
      acc[key] = data.poll[key];
    }
    return acc;
  }, {});

  if (update.status) {
    await PollModel.findOneAndUpdate(
      { _id: data.id },
      {
        $push: {
          events: { name: update.status, at: new Date() },
        },
      },
      {
        upsert: false,
      },
    );
  }

  const poll = await PollModel.findOneAndUpdate({ _id: data.id }, update, {
    upsert: false,
    new: true,
  });

  if (!poll) {
    throw new Error("poll not found");
  }

  await onPollsUpdated(poll.spaceSlug);

  return {
    payload: poll,
  };
}

export const adminPollRemoveDecoder = JsonDecoder.object<AdminPollRemoveReq>(
  {
    id: JsonDecoder.string,
    secret: JsonDecoder.string,
  },
  "adminPollRemoveDecoder",
);

export async function handleAdminPollRemove(
  data: AdminPollRemoveReq,
): Promise<HandlerResult<null>> {
  const PollModel = await getPollModel();
  const poll = await PollModel.findByIdAndDelete(data.id);

  if (poll) {
    await onPollsUpdated(poll.spaceSlug);
  }

  return {
    payload: null,
  };
}
