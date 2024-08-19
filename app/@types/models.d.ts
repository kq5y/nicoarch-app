import type { Document, Types } from "mongoose";

type Status =
  | "queued"
  | "fetching"
  | "downloading"
  | "comment"
  | "completed"
  | "failed";

interface ITask extends Document {
  watchId: string;
  status: Status;
  videoId: Types.ObjectId | null;
  error: string | null;
  commentCount: number | null;
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

interface IComment extends Document {
  commentId: string;
  body: string;
  commands: string[];
  isPremium: boolean;
  nicoruCount: number;
  no: number;
  postedAt: Date;
  score: number;
  source: string;
  userId: string;
  vposMs: number;
  videoId: Types.ObjectId;
  threadId: string;
  fork: string;
}
