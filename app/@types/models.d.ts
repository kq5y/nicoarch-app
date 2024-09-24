import type { Document, Types } from "mongoose";

type TaskStatusEnum =
  | "queued"
  | "fetching"
  | "downloading"
  | "comment"
  | "completed"
  | "failed";

type TaskTypeEnum = "new" | "update";

interface TaskType {
  watchId: string;
  status: TaskStatusEnum;
  videoId?: Types.ObjectId | null;
  error?: string | null;
  commentCount?: number | null;
  type: TaskTypeEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ITask extends Document, TaskType {}

interface UserType {
  userId: number;
  nickname: string;
  description: string;
  registeredVersion: string;
  contentId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IUser extends Document, UserType {}

interface ICount {
  view: number;
  comment: number;
  mylist: number;
  like: number;
}

type VideoType = {
  title: string;
  watchId: string;
  registeredAt: Date;
  count: ICount;
  ownerId?: Types.ObjectId | null;
  duration: number;
  description: string;
  shortDescription: string;
  taskId?: Types.ObjectId | null;
  contentId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

interface IVideo extends Document, VideoType {}

type CommentType = {
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
  createdAt?: Date;
  updatedAt?: Date;
};

interface IComment extends Document, CommentType {}
