import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "nicoarch" }, { name: "description", content: "nicoarch" }];
};

export default function Index() {
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Home</h1>
      <p>ニコニコ動画のアーカイブツール</p>
    </div>
  );
}
