import type { ISpace } from "@amfa-team/space-service-types";
import type { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";

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
    enabled: {
      type: Boolean,
      required: true,
      index: true,
      default: false,
    },
    imageUrl: {
      type: String,
      required: true,
      default: null,
    },
  },
  {
    minimize: false,
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  },
);

const SpaceModel = mongoose.model<ISpaceDocument>("Space", SpaceSchema);

export type { ISpaceDocument };
export { SpaceModel };
