import type { Document, Types } from "mongoose";

type Status = "queued" | "fetching" | "downloading" | "completed" | "failed";

interface ITask extends Document {
  watchId: string;
  status: Status;
  videoId: Types.ObjectId | null;
  error: string | null;
}

interface IUser extends Document {
  userId: number;
  nickname: string;
  description: string;
  registeredVersion: string;
  assetId: string;
}

interface ICount {
  view: number;
  comment: number;
  mylist: number;
  like: number;
}

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
