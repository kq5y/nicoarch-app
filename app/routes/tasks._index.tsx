import type { MetaFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Tasks | nicoarch" },
    { name: "description", content: "nicoarch" },
  ];
};

export default function Index() {
  const navigate = useNavigate();
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
    </div>
  );
}
