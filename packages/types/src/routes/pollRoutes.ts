import type { IPoll, IPollVote, IQuorum } from "../vote/voteModel";
import type { PostRoute } from "./common";

export interface RestrictedReq {
  token: string;
}

export interface PollsReq extends RestrictedReq {
  spaceSlug: string;
}

export interface GetPollVoteReq extends RestrictedReq {
  pollId: string;
}

export interface GetQuorumReq extends RestrictedReq {
  spaceSlug: string;
  save: boolean;
}

export interface QuroumListReq extends RestrictedReq {
  spaceSlug: string;
}

export interface QuorumResultPayload {
  quorum: IQuorum;
}

export interface QuorumListResultPayload {
  quorums: IQuorum[];
}

export interface PollsPayload {
  polls: IPoll[];
}

export interface SubmitVoteReq extends PollsReq {
  pollId: string;
  choice: string;
}

export interface SubmitVotePayload {
  success: boolean;
}

export interface PollVotePayload {
  vote: IPollVote | null;
}

export interface PollResultPayload {
  poll: IPoll;
  result: Record<string, number>;
}

export type PollsPublicPostRoutes = {
  "polls/list": PostRoute<PollsReq, PollsPayload>;
  "polls/vote/submit": PostRoute<SubmitVoteReq, SubmitVotePayload>;
  "polls/vote/get": PostRoute<GetPollVoteReq, PollVotePayload>;
  "polls/result": PostRoute<GetPollVoteReq, PollResultPayload>;
  "quorum/get": PostRoute<GetQuorumReq, QuorumResultPayload>;
  "quorum/list": PostRoute<QuroumListReq, QuorumListResultPayload>;
};
