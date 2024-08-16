import { model, Schema } from "mongoose";

import type { IUser } from "~/@types/models";

const UserSchema = new Schema<IUser>(
  {
    userId: {
      type: Number,
      required: true,
      unique: true,
    },
    nickname: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    registeredVersion: {
      type: String,
      required: true,
    },
    assetId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IUser>("User", UserSchema);
