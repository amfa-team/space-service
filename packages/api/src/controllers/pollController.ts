import type {
  GetPollVoteReq,
  PollResultPayload,
  PollVotePayload,
  PollsPayload,
  PollsReq,
  SubmitVotePayload,
  SubmitVoteReq,
} from "@amfa-team/space-service-types";
import {
  canAccessSpace,
  canManageSpace,
  parseUserServiceToken,
} from "@amfa-team/user-service-node";
import type { IPublicUserData } from "@amfa-team/user-service-types";
import { JsonDecoder } from "ts.data.json";
import { getPollModel } from "../mongo/model/poll";
import { getPollVoteModel } from "../mongo/model/pollVote";
import { getSpaceModel } from "../mongo/model/space";
import { getVoterModel } from "../mongo/model/voter";
import { ForbiddenError } from "../services/io/exceptions";
import type { HandlerResult } from "../services/io/types";

export const pollListReqDecoder = JsonDecoder.object<PollsReq>(
  {
    token: JsonDecoder.string,
    spaceSlug: JsonDecoder.string,
  },
  "pollListReqDecoder",
);

export const pollVoteGetReqDecoder = JsonDecoder.object<GetPollVoteReq>(
  {
    token: JsonDecoder.string,
    pollId: JsonDecoder.string,
  },
  "pollVoteGetReqDecoder",
);

export async function handlePollList(
  req: PollsReq,
): Promise<HandlerResult<PollsPayload>> {
  const SpaceModel = await getSpaceModel();
  const PollModel = await getPollModel();

  const userData = parseUserServiceToken(req.token);
  const space = await SpaceModel.findById(req.spaceSlug);

  if (space === null) {
    return {
      payload: {
        polls: [],
      },
    };
  }

  if (!space.public && !canAccessSpace(userData, req.spaceSlug)) {
    return { payload: { polls: [] } };
  }

  const polls = await PollModel.find({ spaceSlug: req.spaceSlug });

  return {
    payload: {
      polls: polls.map((p) => p.toJSON()),
    },
  };
}

export async function handlePollVoteGet(
  req: GetPollVoteReq,
): Promise<HandlerResult<PollVotePayload>> {
  const PollVoteModel = await getPollVoteModel();

  const userData = parseUserServiceToken(req.token);

  if (!userData.email) {
    return {
      payload: {
        vote: null,
      },
    };
  }

  const vote = await PollVoteModel.findOne({
    pollId: req.pollId,
    voter: userData.email,
  });
  return {
    payload: {
      vote: vote?.toJSON() ?? null,
    },
  };
}

export async function handlePollResult(
  req: GetPollVoteReq,
): Promise<HandlerResult<PollResultPayload>> {
  const [PollModel, PollVoteModel, VoterModel] = await Promise.all([
    getPollModel(),
    getPollVoteModel(),
    getVoterModel(),
  ]);

  const userData = parseUserServiceToken(req.token);
  const poll = await PollModel.findById(req.pollId);

  if (!poll || !canManageSpace(userData, poll.spaceSlug)) {
    throw new ForbiddenError();
  }

  const [votes, voters] = await Promise.all([
    PollVoteModel.find({ pollId: poll._id }),
    VoterModel.find({ spaceSlug: poll.spaceSlug }),
  ]);

  console.log({ votes, voters, poll, req });

  const weightMap = voters.reduce<Record<string, number>>((acc, voter) => {
    acc[voter.email] = voter.count;
    return acc;
  }, {});

  const emptyResult = poll.choices.reduce<Record<string, number>>(
    (acc, choice) => {
      acc[choice] = 0;
      return acc;
    },
    {},
  );

  const result = votes.reduce<Record<string, number>>((acc, vote) => {
    const currentValue = acc[vote.choice] ?? 0;

    const weight = weightMap[vote.voter] ?? 0;
    acc[vote.choice] = currentValue + weight;

    return acc;
  }, emptyResult);

  console.log({ weightMap, result });

  return {
    payload: {
      result,
      poll,
    },
  };
}

export const submitVoteReqDecoder = JsonDecoder.object<SubmitVoteReq>(
  {
    token: JsonDecoder.string,
    pollId: JsonDecoder.string,
    spaceSlug: JsonDecoder.string,
    choice: JsonDecoder.string,
  },
  "submitVoteReqDecoder",
);

export async function handleSubmitVote(
  req: SubmitVoteReq,
): Promise<HandlerResult<SubmitVotePayload>> {
  const [SpaceModel, PollModel, PollVoteModel] = await Promise.all([
    getSpaceModel(),
    getPollModel(),
    getPollVoteModel(),
  ]);

  const userData: IPublicUserData = parseUserServiceToken(req.token);
  const [space, poll] = await Promise.all([
    SpaceModel.findById(req.spaceSlug),
    PollModel.findById(req.pollId),
  ]);

  if (space === null || poll === null || poll.spaceSlug !== req.spaceSlug) {
    return {
      payload: {
        success: false,
      },
    };
  }

  if (!userData.email || !userData.registered || !userData.verified) {
    return {
      payload: {
        success: false,
      },
    };
  }

  if (!space.public && !canAccessSpace(userData, space._id)) {
    return { payload: { success: false } };
  }

  await PollVoteModel.findOneAndUpdate(
    { pollId: poll._id, voter: userData.email },
    {
      choice: req.choice,
      at: new Date(),
    },
    { upsert: true },
  );

  return { payload: { success: true } };
}
