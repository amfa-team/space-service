import type { ISpace } from "@amfa-team/space-service-types";
import type { Document, Model } from "mongoose";
import { Schema } from "mongoose";
import { connect } from "../client";

interface ISpaceDocument extends ISpace, Document {
  id: string;
  _id: string;
}

const SpaceSchema: Schema = new Schema(
  {
    _id: {
      type: String,
      required: true,
      description: "space unique slug id",
    },
    name: {
      type: String,
      required: true,
      unique: true,
      description: "space unique name",
    },
    description: {
      type: String,
      required: true,
    },
    highlight: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    enabled: {
      type: Boolean,
      required: true,
      index: true,
      default: false,
    },
    public: {
      type: Boolean,
      required: true,
      index: true,
      default: true,
    },
    imageUrl: {
      type: String,
      required: true,
      default: null,
    },
    random: {
      type: Boolean,
      required: true,
      index: true,
      default: false,
    },
    home: {
      type: Boolean,
      required: true,
      index: true,
      default: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    live: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    minimize: false,
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  },
);

SpaceSchema.index(
  { enabled: 1, home: 1, order: 1 }, // home page list
);

SpaceSchema.index(
  { enabled: 1, public: 1, home: 1, random: 1 }, // random resolution
);

async function getSpaceModel(): Promise<Model<ISpaceDocument>> {
  const client = await connect();
  return client.model<ISpaceDocument>("Space", SpaceSchema);
}

export type { ISpaceDocument };
export { getSpaceModel };
