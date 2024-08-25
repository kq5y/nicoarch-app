import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

import {
  RiChat4Fill,
  RiFolderFill,
  RiHeartFill,
  RiPlayFill,
} from "@remixicon/react";
import NiconiComments from "@xpadev-net/niconicomments";
import ReactFilePlayer from "react-player/file";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

import Comment from "~/models/Comment";
import User from "~/models/User";
import Video from "~/models/Video";
import connectMongo from "~/utils/mongo";

import type ReactPlayer from "react-player";
import type { IComment, IUser, IVideo } from "~/@types/models";

interface LoaderData {
  error?: string;
  video?: IVideo;
  user?: IUser;
  comments?: IComment[];
}

export const meta: MetaFunction = () => {
  return [
    { title: "Watch | nicoarch" },
    { name: "description", content: "nicoarch" },
  ];
};

export const loader: LoaderFunction = async ({ params }) => {
  const watchId = params.watchId;
  try {
    await connectMongo();
    const video = await Video.findOne({
      watchId,
    }).lean();
    if (!video) {
      return typedjson({ error: "動画が存在しません。" }, 404);
    }
    const user = await User.findOne({
      _id: video.ownerId,
    }).lean();
    const comments = await Comment.find({
      videoId: video._id,
    })
      .sort({ postedAt: -1 })
      .limit(1000)
      .lean();
    return typedjson({ video, user, comments }, 200);
  } catch (e) {
    console.error(e);
    return typedjson({ error: "エラーが発生しました。" }, 500);
  }
};

export default function Index() {
  const loaderData = useTypedLoaderData<LoaderData>();
  const niconicommentsRef = useRef<NiconiComments | undefined>(undefined);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(
    null
  );
  const commentSmoothingRef = useRef({ offset: 0, timestamp: 0 });
  const handlePlayerReady = (player: ReactPlayer) => {
    setVideoElement(player.getInternalPlayer() as HTMLVideoElement);
  };
  useEffect(() => {
    if (!videoElement) {
      return;
    }
    const updateTimestamp = () => {
      if (!videoElement) {
        return;
      }
      commentSmoothingRef.current = {
        offset: videoElement.currentTime ?? 0,
        timestamp: performance.now(),
      };
    };
    videoElement.addEventListener("play", updateTimestamp);
    videoElement.addEventListener("timeupdate", updateTimestamp);
    console.log("videoRefCurrent", videoElement);
    return () => {
      videoElement.removeEventListener("play", updateTimestamp);
      videoElement.removeEventListener("timeupdate", updateTimestamp);
    };
  }, [videoElement]);
  useEffect(() => {
    if (!canvasRef.current || !videoElement || !loaderData.video) {
      return;
    }
    niconicommentsRef.current = new NiconiComments(
      canvasRef.current,
      [
        {
          comments: (loaderData.comments || []).map((comment) => ({
            id: comment.commentId,
            no: comment.no,
            vposMs: comment.vposMs,
            body: comment.body,
            commands: comment.commands,
            userId: comment.userId,
            isPremium: comment.isPremium,
            score: comment.score,
            postedAt: new Date(comment.postedAt).toISOString(),
            nicoruCount: comment.nicoruCount,
            nicoruId: null,
            source: comment.source,
            isMyPost: false,
          })),
          id: "0",
          fork: "main",
          commentCount: 0,
        },
      ],
      { format: "v1" }
    );
    console.log("niconicommentsRef", niconicommentsRef.current);
    return () => {
      niconicommentsRef.current = undefined;
    };
  }, [loaderData.comments, loaderData.video, videoElement, canvasRef]);
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (!videoElement || !niconicommentsRef.current) {
        return;
      }
      const vposMs = videoElement.paused
        ? Math.floor(videoElement.currentTime * 1000)
        : performance.now() -
          commentSmoothingRef.current.timestamp +
          commentSmoothingRef.current.offset * 1000;
      niconicommentsRef.current.drawCanvas(Math.floor(vposMs / 10));
    }, 1);
    console.log("interval", interval);
    return () => {
      window.clearInterval(interval);
    };
  }, [videoElement, niconicommentsRef]);
  return (
    <div className="w-full max-w-3xl mx-auto mt-4 px-4">
      {!loaderData.video ? (
        <div className="w-full max-w-3xl mx-auto mt-4 px-4">
          <h1 className="text-3xl mb-2">Not Found</h1>
          <p>{loaderData.error || "動画が見つかりませんでした。"}</p>
        </div>
      ) : (
        <div className="w-full max-w-3xl mx-auto mt-4 px-4 flex flex-col gap-2">
          <div className="relative aspect-video bg-zinc-900 w-full max-w-3xl">
            <div className="w-full h-full flex justify-center absolute top-0 left-0 z-10 pointer-events-auto">
              <ReactFilePlayer
                height="100%"
                width="auto"
                url={`/contents/video/${loaderData.video.contentId}.mp4`}
                onReady={handlePlayerReady}
                controls
              />
            </div>
            <div className="w-full h-full absolute top-0 left-0 z-20 opacity-100 pointer-events-none">
              <canvas
                className="w-full h-full absolute top-0 left-0 touch-none"
                ref={canvasRef}
                width={1920}
                height={1080}
              />
            </div>
          </div>
          <div className="w-full flex flex-row h-14">
            <div className="w-3/4 h-full">
              <h1 className="text-xl w-full text-wrap">
                {loaderData.video.title}
              </h1>
              <div className="w-full flex flex-row gap-2 text-sm text-gray-700">
                <div>{loaderData.video.registeredAt.toLocaleString("ja")}</div>
                <div className="flex flex-row gap-1">
                  <RiPlayFill />
                  <span>{loaderData.video.count.view.toLocaleString()}</span>
                </div>
                <div className="flex flex-row gap-1">
                  <RiChat4Fill />
                  <span>{loaderData.video.count.comment.toLocaleString()}</span>
                </div>
                <div className="flex flex-row gap-1">
                  <RiHeartFill />
                  <span>{loaderData.video.count.like.toLocaleString()}</span>
                </div>
                <div className="flex flex-row gap-1">
                  <RiFolderFill />
                  <span>{loaderData.video.count.mylist.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="w-1/4 h-full p-2 flex flex-row gap-2">
              <img
                src={`/contents/image/icon/${loaderData.user?.contentId}.jpg`}
                alt="icon"
                className="w-12 h-12 rounded-full bg-gray-500"
              />
              <span>{loaderData.user?.nickname || "Unknown"}</span>
            </div>
          </div>
          <div className="w-full flex flex-row gap-2">
            <Link to={`/tasks/update?watchId=${loaderData.video.watchId}`}>
              Create Update Task
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
