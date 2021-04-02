import type { IPoll } from "@amfa-team/space-service-types";
import type { Document } from "mongoose";
import { Schema } from "mongoose";
import { connect } from "../client";

interface IPollDocument extends IPoll, Document {
  id: string;
  _id: string;
}

const PollSchema: Schema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    choices: {
      type: [String],
      required: true,
    },
    spaceSlug: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["created", "started", "ended", "canceled"],
      default: "created",
    },
    events: {
      type: [
        {
          name: {
            type: String,
            required: true,
          },
          at: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      required: true,
      index: true,
      default: () => [{ type: "created", at: Date.now() }],
    },
  },
  {
    minimize: false,
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  },
);

async function getPollModel() {
  const client = await connect();
  return client.model<IPollDocument>("Poll", PollSchema);
}

export type { IPollDocument };
export { getPollModel };
