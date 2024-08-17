import {
  redirect,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import { NavLink, useNavigate } from "@remix-run/react";

import { typedjson, useTypedLoaderData } from "remix-typedjson";

import Video from "~/models/Video";
import connectMongo from "~/utils/mongo";

import type { IVideo } from "~/@types/models";

interface LoaderData {
  error?: string;
  videos: IVideo[];
  count: number;
  page: number;
}

export const meta: MetaFunction = () => {
  return [
    { title: "Videos | nicoarch" },
    { name: "description", content: "nicoarch" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const query = new URL(request.url);
  const page = Number(query.searchParams.get("page") || "1");
  try {
    await connectMongo();
    const count = await Video.countDocuments();
    if (page < 1 || page > Math.ceil(count / 5)) {
      return redirect(`/videos`, { status: 302 });
    }
    const videos = (
      await Video.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .skip((page - 1) * 5)
        .exec()
    ).map((video) => video.toObject<IVideo>());
    return typedjson({ videos, count, page }, 200);
  } catch {
    return typedjson(
      { page, error: "エラーが発生しました。", tasks: [], count: 0 },
      500
    );
  }
};

export default function Index() {
  const navigate = useNavigate();
  const loaderData = useTypedLoaderData<LoaderData>();
  const maxPage = Math.ceil(loaderData.count / 5);
  const handlePageChange = (page: number) => {
    page = Math.min(Math.max(1, page), maxPage);
    navigate(`/tasks?page=${page}`);
  };
  return (
    <div className="w-full max-w-3xl mx-auto mt-4 px-4">
      <h1 className="text-3xl mb-2">Videos</h1>
      <div className="flex flex-col">
        {loaderData.error ? (
          <p className="text-red-500">{loaderData.error}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4">
              {loaderData.videos.map((video, i) => (
                <NavLink
                  key={i}
                  to={`/videos/${video.watchId}`}
                  className="border-b border-gray-200 py-2"
                >
                  <img
                    src={`/contents/image/thumbnail/${video.contentId}.jpg`}
                    alt="thumbnail"
                  />
                  <div>
                    <h2 className="text-xl">{video.title}</h2>
                    <p className="text-gray-500">{video.description}</p>
                  </div>
                </NavLink>
              ))}
            </div>
            <div className="flex justify-end gap-2 items-center">
              <button
                onClick={() => handlePageChange(loaderData.page - 1)}
                disabled={loaderData.page <= 1}
                className="text-xl hover:drop-shadow-xl  disabled:opacity-50"
              >
                &lt;
              </button>
              <span className="text-lg">{loaderData.page}</span>
              <button
                onClick={() => handlePageChange(loaderData.page + 1)}
                disabled={loaderData.page >= maxPage}
                className="text-xl hover:drop-shadow-xl  disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
