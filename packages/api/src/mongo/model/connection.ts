import type { IConnection } from "@amfa-team/space-service-types";
import type { Document } from "mongoose";
import { Schema } from "mongoose";
import { connect } from "../client";

interface IConnectionDocument extends IConnection, Document {
  id: string;
  _id: string;
}

const ConnectionSchema: Schema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    spaceSlug: {
      type: String,
      required: true,
      index: true,
    },
    canManage: {
      type: Boolean,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    minimize: false,
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  },
);

async function getConnectionModel() {
  const client = await connect();
  return client.model<IConnectionDocument>("Connection", ConnectionSchema);
}

export type { IConnectionDocument };
export { getConnectionModel };
