import type { IPermission } from "@amfa-team/space-service-types";
import type { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";

interface IPermissionDocument extends IPermission, Document {
  id: string;
  _id: string;
}

const PermissionSchema: Schema = new Schema(
  {
    spaceId: {
      type: String,
      ref: "Space",
      required: true,
      index: true,
    },
    userEmail: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["admin"],
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

PermissionSchema.index({ spaceId: 1, userEmail: 1 }, { unique: true });

const PermissionModel = mongoose.model<IPermissionDocument>(
  "Permission",
  PermissionSchema,
);

export type { IPermissionDocument };
export { PermissionModel };
