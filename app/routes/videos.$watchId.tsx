import type { LoaderFunction, MetaFunction } from "@remix-run/node";

import ReactPlayer from "react-player";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

import Video from "~/models/Video";
import connectMongo from "~/utils/mongo";

import type { IVideo } from "~/@types/models";

interface LoaderData {
  error?: string;
  video?: IVideo;
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
    return typedjson(
      {
        video: video.toObject<IVideo>(),
      },
      200
    );
  } catch {
    return typedjson({ error: "エラーが発生しました。" }, 500);
  }
};

export default function Index() {
  const loaderData = useTypedLoaderData<LoaderData>();
  return (
    <div className="w-full max-w-3xl mx-auto mt-4 px-4">
      {loaderData.error || !loaderData.video ? (
        <div>
          <h1 className="text-3xl mb-2">Not Found</h1>
          <p>{loaderData.error}</p>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl mb-2">{loaderData.video.title}</h1>
          <ReactPlayer
            url={`/contents/video/${loaderData.video.contentId}.mp4`}
            controls
          />
        </div>
      )}
    </div>
  );
}
