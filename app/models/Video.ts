import { Document, model, Schema, Types } from "mongoose";

interface ICount {
  view: number;
  comment: number;
  mylist: number;
  like: number;
}

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

interface IVideo extends Document {
  title: string;
  watchId: string;
  registeredAt: Date;
  count: ICount;
  ownerId: Types.ObjectId;
  duration: number;
  description: string;
  taskId: Types.ObjectId;
  assetId: string;
}

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
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
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

export default model<IVideo>("Video", VideoSchema);
