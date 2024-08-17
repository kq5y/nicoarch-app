import mongoose, { Schema } from "mongoose";

import type { Model } from "mongoose";
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
    contentId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

interface UserModel extends Model<IUser> {}

export default mongoose.models.User
  ? (mongoose.models.User as UserModel)
  : mongoose.model<IUser, UserModel>("User", UserSchema);
