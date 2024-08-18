import mongoose, { Schema } from "mongoose";

import type { Model } from "mongoose";
import type { ITask } from "~/@types/models";

const TaskSchema = new Schema<ITask>(
  {
    watchId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "queued",
      enum: [
        "queued",
        "fetching",
        "downloading",
        "comment",
        "completed",
        "failed",
      ],
    },
    videoId: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: false,
    },
    error: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

interface TaskModel extends Model<ITask> {}

export default mongoose.models.Task
  ? (mongoose.models.Task as TaskModel)
  : mongoose.model<ITask, TaskModel>("Task", TaskSchema);
