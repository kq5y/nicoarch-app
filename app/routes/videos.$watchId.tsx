import type { LoaderFunction, MetaFunction } from "@remix-run/node";

import ReactPlayer from "react-player";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

import Comment from "~/models/Comment";
import Video from "~/models/Video";
import connectMongo from "~/utils/mongo";

import type { IComment } from "@xpadev-net/niconicomments";
import type { IVideo } from "~/@types/models";

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
    });
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
  return (
    <div className="w-full max-w-3xl mx-auto mt-4 px-4">
      {loaderData.error || !loaderData.video ? (
        <div className="w-full max-w-3xl mx-auto mt-4 px-4">
          <h1 className="text-3xl mb-2">Not Found</h1>
          <p>{loaderData.error}</p>
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
                controls
              />
            </div>
            <div className="w-full h-full absolute top-0 left-0 z-20 opacity-100 pointer-events-none">
              <canvas className="w-full h-full absolute top-0 left-0 touch-none" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
