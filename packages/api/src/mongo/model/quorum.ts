import type { IQuorum } from "@amfa-team/space-service-types";
import type { Document } from "mongoose";
import { Schema } from "mongoose";
import { connect } from "../client";

interface IQuorumDocument extends IQuorum, Document {
  id: string;
  _id: string;
}

const QuorumSchema: Schema = new Schema(
  {
    spaceSlug: {
      type: String,
      required: true,
      index: true,
    },
    liveUsers: {
      type: [String],
      required: true,
    },
    at: {
      type: Date,
      required: true,
      index: true,
    },
    totalWeight: {
      type: Number,
      required: true,
    },
    liveWeight: {
      type: Number,
      required: true,
    },
  },
  {
    minimize: false,
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  },
);

async function getQuorumModel() {
  const client = await connect();
  return client.model<IQuorumDocument>("Quorum", QuorumSchema);
}

export type { IQuorumDocument };
export { getQuorumModel };
