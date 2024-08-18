import mongoose, { Schema } from "mongoose";

import type { Model } from "mongoose";
import type { IComment } from "~/@types/models";

const CommentSchema = new Schema<IComment>(
  {
    commentId: {
      type: String,
      required: true,
      unique: true,
    },
    body: {
      type: String,
      required: true,
    },
    commands: {
      type: [String],
      required: true,
    },
    isPremium: {
      type: Boolean,
      required: true,
    },
    nicoruCount: {
      type: Number,
      required: true,
    },
    no: {
      type: Number,
      required: true,
    },
    postedAt: {
      type: Date,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    vposMs: {
      type: Number,
      required: true,
    },
    videoId: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    threadId: {
      type: String,
      required: true,
    },
    fork: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

interface CommentModel extends Model<IComment> {}

export default mongoose.models.Comment
  ? (mongoose.models.Comment as CommentModel)
  : mongoose.model<IComment, CommentModel>("Comment", CommentSchema);
