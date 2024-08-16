import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Videos | nicoarch" },
    { name: "description", content: "nicoarch" },
  ];
};

export default function Index() {
  return (
    <div className="w-full max-w-3xl mx-auto mt-4 px-4">
      <h1 className="text-3xl mb-2">Videos</h1>
    </div>
  );
}
