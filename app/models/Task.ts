import { model, Schema } from "mongoose";

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
      enum: ["queued", "fetching", "downloading", "completed", "failed"],
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

export default model<ITask>("Task", TaskSchema);
