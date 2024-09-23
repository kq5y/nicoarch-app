import mongoose, { Schema } from "mongoose";

import type { Model } from "mongoose";
import type { ICount, IVideo } from "~/@types/models";

const CountSchema = new Schema<ICount>({
  view: {
    type: Number,
    required: true,
  },
  comment: {
    type: Number,
    required: true,
  },
  mylist: {
    type: Number,
    required: true,
  },
  like: {
    type: Number,
    required: true,
  },
});

const VideoSchema = new Schema<IVideo>(
  {
    title: {
      type: String,
      required: true,
    },
    watchId: {
      type: String,
      required: true,
      unique: true,
    },
    registeredAt: {
      type: Date,
      required: true,
    },
    count: {
      type: CountSchema,
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },
    duration: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: false,
      default: null,
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

interface VideoModel extends Model<IVideo> {}

export default mongoose.models.Video
  ? (mongoose.models.Video as VideoModel)
  : mongoose.model<IVideo, VideoModel>("Video", VideoSchema);
