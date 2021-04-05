export interface IVoter {
  email: string;
  spaceSlug: string;
  count: number;
}

export interface IPollChoice {
  id: string;
  description: string;
}

export type PollStatus = "created" | "started" | "ended" | "canceled";

export interface IPollEvent {
  name: PollStatus;
  at: Date;
}

export interface IPoll {
  _id: string;
  question: string;
  choices: string[];
  spaceSlug: string;
  status: PollStatus;
  events: IPollEvent[];
}

export interface IPollVote {
  at: Date;
  voter: string;
  pollId: string;
  choice: string;
}

export interface IConnection {
  _id: string;
  email: string;
  canManage: boolean;
  spaceSlug: string;
}

export interface IQuorum {
  at: string;
  spaceSlug: string;
  liveUsers: string[];
  totalWeight: number;
  liveWeight: number;
}
