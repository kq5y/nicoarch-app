import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useEffect, useRef } from "react";

import NiconiComments from "@xpadev-net/niconicomments";
import ReactPlayer from "react-player";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

import Comment from "~/models/Comment";
import Video from "~/models/Video";
import connectMongo from "~/utils/mongo";

import type { IComment, IVideo } from "~/@types/models";

interface LoaderData {
  error?: string;
  video?: IVideo;
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
    const comments = await Comment.find({
      videoId: video._id,
    })
      .sort({ postedAt: -1 })
      .limit(1000)
      .lean();
    return typedjson(
      {
        video: video.toObject<IVideo>(),
        comments: comments.map((comment) => comment.toObject<IComment>()),
      },
      200
    );
  } catch (e) {
    console.error(e);
    return typedjson({ error: "エラーが発生しました。" }, 500);
  }
};

export default function Index() {
  const loaderData = useTypedLoaderData<LoaderData>();
  const niconicommentsRef = useRef<NiconiComments | undefined>(undefined);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!canvasRef.current || !videoRef.current || !loaderData.video) {
      return;
    }
    niconicommentsRef.current = new NiconiComments(
      canvasRef.current,
      [
        {
          comments: (loaderData.comments || []).map((comment) => ({
            id: comment.commentId,
            isMyPost: false,
            ...comment,
          })),
          id: "0",
          fork: "main",
          commentCount: 0,
        },
      ],
      { video: videoRef.current }
    );
    return () => {
      niconicommentsRef.current = undefined;
    };
  }, [loaderData.comments, loaderData.video]);
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (!videoRef.current || !niconicommentsRef.current) {
        return;
      }
      const vposMs = Math.floor(videoRef.current.currentTime * 1000);
      niconicommentsRef.current.drawCanvas(Math.floor(vposMs / 10));
    }, 1);
    return () => {
      window.clearInterval(interval);
    };
  }, []);
  return (
    <div className="w-full max-w-3xl mx-auto mt-4 px-4">
      {!loaderData.video ? (
        <div className="w-full max-w-3xl mx-auto mt-4 px-4">
          <h1 className="text-3xl mb-2">Not Found</h1>
          <p>{loaderData.error || "動画が見つかりませんでした。"}</p>
        </div>
      ) : (
        <div className="w-full max-w-3xl mx-auto mt-4 px-4">
          <h1 className="text-3xl mb-2">{loaderData.video.title}</h1>
          <div className="relative aspect-video bg-zinc-900 w-full max-w-3xl">
            <div className="w-full h-full flex justify-center absolute top-0 left-0 z-10 pointer-events-auto">
              <ReactPlayer
                height="100%"
                width="auto"
                url={`/contents/video/${loaderData.video.contentId}.mp4`}
                videoRef={videoRef}
                controls
              />
            </div>
            <div className="w-full h-full absolute top-0 left-0 z-20 opacity-100 pointer-events-none">
              <canvas
                className="w-full h-full absolute top-0 left-0 touch-none"
                ref={canvasRef}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
