import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useNavigate } from "@remix-run/react";

import { redirect, typedjson, useTypedLoaderData } from "remix-typedjson";

import Task from "~/models/Task";
import connectMongo from "~/utils/mongo";

import type { ITask, Status, TaskType } from "~/@types/models";

interface LoaderData {
  error?: string;
  tasks: ITask[];
  count: number;
  page: number;
}

function taskTypeString(type: TaskType) {
  switch (type) {
    case "new":
      return "新規";
    case "update":
      return "更新";
    default:
      return type;
  }
}

function statusString(status: Status) {
  switch (status) {
    case "queued":
      return "待機中";
    case "fetching":
      return "情報取得中";
    case "downloading":
      return "ダウンロード中";
    case "comment":
      return "コメント取得中";
    case "completed":
      return "完了";
    case "failed":
      return "失敗";
    default:
      return status;
  }
}

export const meta: MetaFunction = () => {
  return [
    { title: "Tasks | nicoarch" },
    { name: "description", content: "nicoarch" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const query = new URL(request.url);
  const page = Number(query.searchParams.get("page") || "1");
  try {
    await connectMongo();
    const count = await Task.countDocuments();
    if (count > 0 && (page < 1 || page > Math.ceil(count / 5))) {
      return redirect(`/tasks`, { status: 302 });
    }
    const tasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .skip((page - 1) * 5)
      .lean();
    return typedjson({ tasks, count, page }, 200);
  } catch (e) {
    console.error(e);
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
      <div className="flex items-center mb-2">
        <h1 className="text-3xl">Tasks</h1>
        <button
          className="bg-gray-500 text-white font-bold py-2 px-4 rounded ml-auto"
          onClick={() => navigate("/tasks/new")}
          type="button"
        >
          新規タスク
        </button>
      </div>
      <div className="flex flex-col">
        {loaderData.error ? (
          <p className="text-red-500">{loaderData.error}</p>
        ) : (
          <>
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">動画ID</th>
                  <th className="px-6 py-3">種類</th>
                  <th className="px-6 py-3">ステータス</th>
                  <th className="px-6 py-3">作成日時</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {loaderData.tasks.map((task, i) => (
                  <tr key={i} className="text-black bg-white border-b">
                    <td className="px-6 py-3">
                      {task.status === "completed" ? (
                        <Link to={`/videos/${task.watchId}`}>
                          {task.watchId}
                        </Link>
                      ) : (
                        task.watchId
                      )}
                    </td>
                    <td className="px-6 py-3">{taskTypeString(task.type)}</td>
                    <td className="px-6 py-3">
                      {`${statusString(task.status)}${task.status == "comment" && task.commentCount ? "(" + task.commentCount.toString() + ")" : ""}`}
                    </td>
                    <td className="px-6 py-3">
                      {task.createdAt.toLocaleString("ja-JP", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-3">
                      {task.status == "failed" && (
                        <p className="text-red-500">{task.error}</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
