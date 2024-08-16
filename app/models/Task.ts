import { Document, model, Schema, Types } from "mongoose";

type Status = "queued" | "fetching" | "downloading" | "completed" | "failed";

interface ITask extends Document {
  watchId: string;
  status: Status;
  videoId: Types.ObjectId | null;
  error: string | null;
}

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
