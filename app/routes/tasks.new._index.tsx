import {
  redirect,
  type ActionFunction,
  type MetaFunction,
} from "@remix-run/node";
import { useActionData } from "@remix-run/react";

import Task from "~/models/Task";
import connectMongo from "~/utils/mongo";
import connectRedis from "~/utils/redis";

interface ActionData {
  error?: string;
}

export const meta: MetaFunction = () => {
  return [
    { title: "New Task | nicoarch" },
    { name: "description", content: "nicoarch" },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const watchId = formData.get("watchId") as string | null;
  if (watchId) {
    try {
      await connectMongo();
      const task = await Task.create({ watchId });
      const redisClient = connectRedis();
      await redisClient.rpush("tasks", String(task.id));
      redisClient.disconnect();
    } catch (error) {
      console.error(error);
      return { error: "エラーが発生しました。" };
    }
    return redirect(`/tasks`);
  } else {
    return { error: "動画IDが空です。" };
  }
};

export default function Index() {
  const actionData = useActionData<ActionData>();
  return (
    <div className="w-full max-w-3xl mx-auto mt-4 px-4">
      <h1 className="text-3xl mb-2">New Task</h1>
      {actionData && actionData.error && (
        <p className="text-red-500 text-sm mb-2">{actionData.error}</p>
      )}
      <form method="post">
        <div className="flex items-center mb-2">
          <label className="w-1/3 block font-bold" htmlFor="watchId">
            動画ID
          </label>
          <input
            className="w-2/3 appearance-none border-2 border-gray-200 py-2 px-4 rounded"
            type="text"
            name="watchId"
            id="watchId"
            placeholder="e.g. sm9"
            required
          />
        </div>
        <div className="flex mb-2">
          <button
            className="bg-gray-500 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            送信
          </button>
        </div>
      </form>
    </div>
  );
}
