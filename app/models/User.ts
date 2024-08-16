import { Document, model, Schema } from "mongoose";

interface IUser extends Document {
  userId: number;
  nickname: string;
  description: string;
  registeredVersion: string;
  assetId: string;
}

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
