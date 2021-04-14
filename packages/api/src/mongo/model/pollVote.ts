import type { IPollVote } from "@amfa-team/space-service-types";
import type { Document } from "mongoose";
import { Schema } from "mongoose";
import { connect } from "../client";

interface IPollVoteDocument extends IPollVote, Document {
  id: string;
  _id: string;
}

const PollVoteSchema: Schema = new Schema(
  {
    pollId: {
      type: String,
      required: true,
    },
    choice: {
      type: String,
      required: true,
    },
    voter: {
      type: String,
      required: true,
      index: true,
    },
    at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    minimize: false,
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  },
);

PollVoteSchema.index({ pollId: 1, voter: 1 }, { unique: true });

async function getPollVoteModel() {
  const client = await connect();
  return client.model<IPollVoteDocument>("PollVote", PollVoteSchema);
}

export type { IPollVoteDocument };
export { getPollVoteModel };
