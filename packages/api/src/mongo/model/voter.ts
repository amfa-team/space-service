import type { IVoter } from "@amfa-team/space-service-types";
import type { Document } from "mongoose";
import { Schema } from "mongoose";
import { connect } from "../client";

interface IVoterDocument extends IVoter, Document {
  id: string;
  _id: string;
}

const VoterSchema: Schema = new Schema(
  {
    spaceSlug: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    minimize: false,
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  },
);

VoterSchema.index({ spaceSlug: 1, email: 1 }, { unique: true });

async function getVoterModel() {
  const client = await connect();
  return client.model<IVoterDocument>("Voter", VoterSchema);
}

export type { IVoterDocument };
export { getVoterModel };
