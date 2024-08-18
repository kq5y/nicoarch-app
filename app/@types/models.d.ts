import type { Document, Types } from "mongoose";

type Status = "queued" | "fetching" | "downloading" | "completed" | "failed";

interface ITask extends Document {
  watchId: string;
  status: Status;
  videoId: Types.ObjectId | null;
  error: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface IUser extends Document {
  userId: number;
  nickname: string;
  description: string;
  registeredVersion: string;
  contentId: string;
  createdAt: Date;
  updatedAt: Date;
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
  shortDescription: string;
  taskId: Types.ObjectId;
  contentId: string;
  createdAt: Date;
  updatedAt: Date;
}
