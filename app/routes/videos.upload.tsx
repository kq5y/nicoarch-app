import {
  redirect,
  type ActionFunction,
  type MetaFunction,
} from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { useCallback, useState } from "react";

import { writeFile } from "fs/promises";

import { v4 as uuidv4 } from "uuid";

import Dropzone from "~/components/Dropzone";
import Video from "~/models/Video";
import { CONTENTS_DIR } from "~/utils/contents";
import connectMongo from "~/utils/mongo";

import type { VideoType } from "~/@types/models";

interface ActionData {
  error?: string;
}

export const meta: MetaFunction = () => {
  return [
    { title: "Upload | nicoarch" },
    { name: "description", content: "nicoarch" },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  if (
    !formData.has("title") ||
    !formData.has("watchId") ||
    !formData.has("registeredAt") ||
    !formData.has("viewCount") ||
    !formData.has("commentCount") ||
    !formData.has("mylistCount") ||
    !formData.has("likeCount") ||
    !formData.has("description") ||
    !formData.has("shortDescription") ||
    !formData.has("contentId") ||
    !formData.has("thumbnailData")
  ) {
    return { error: "不正なリクエストです" };
  }
  try {
    const thumbnailDataBuffer = Buffer.from(
      await (formData.get("thumbnailData") as File).arrayBuffer()
    );
    await writeFile(
      CONTENTS_DIR + "/image/thumbnail/" + formData.get("contentId") + ".jpg",
      thumbnailDataBuffer
    );
  } catch (error) {
    console.error(error);
    return { error: "エラーが発生しました。" };
  }
  const videoObject: VideoType = {
    title: formData.get("title") as string,
    watchId: formData.get("watchId") as string,
    registeredAt: new Date(formData.get("registeredAt") as string),
    count: {
      view: Number(formData.get("viewCount")),
      comment: Number(formData.get("commentCount")),
      mylist: Number(formData.get("mylistCount")),
      like: Number(formData.get("likeCount")),
    },
    duration: 0,
    description: formData.get("description") as string,
    shortDescription: formData.get("shortDescription") as string,
    contentId: formData.get("contentId") as string,
  };
  try {
    await connectMongo();
    await Video.create(videoObject);
  } catch (error) {
    console.error(error);
    return { error: "エラーが発生しました。" };
  }
  return redirect(`/videos`);
};

export default function Upload() {
  const actionData = useActionData<ActionData>();
  const [uploadStatus, setUploadStatus] = useState<UploadStatusType>("Ready");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState<string>("");
  const [contentId, setContentId] = useState<string | undefined>(undefined);
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (uploadStatus !== "Ready") {
        return;
      }
      setUploadProgress(0);
      setFilename(undefined);
      const file = acceptedFiles[0];
      if (!file || file.type !== "video/mp4") {
        setUploadError("動画ファイルを選択してください。");
        return;
      }
      if (file.size > 5 * 1024 * 1024 * 1024) {
        setUploadError("ファイルサイズが大きすぎます。");
        return;
      }
      setUploadStatus("Uploading");
      const assetId = uuidv4();
      const formData = new FormData();
      formData.append("file", file);
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload?assetId=" + assetId, true);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setUploadProgress(Math.round((event.loaded * 100) / event.total));
        }
      };
      xhr.onload = () => {
        const response = JSON.parse(xhr.responseText);
        if (xhr.status === 200) {
          setContentId(assetId);
          setFilename(file.name);
          if (title === "") {
            setTitle(file.name.split(".")[0]);
          }
          setUploadError(null);
          setUploadStatus("Complete");
        } else {
          setUploadError(
            "アップロードに失敗しました。:" + response.meta.errorCode
          );
          setUploadStatus("Ready");
        }
      };
      xhr.onerror = () => {
        setUploadError("アップロードに失敗しました。");
        setUploadStatus("Ready");
      };
      xhr.send(formData);
    },
    [title, uploadStatus]
  );
  return (
    <div className="w-full max-w-3xl mx-auto mt-4 px-4">
      <h1 className="text-3xl mb-2">Upload Video</h1>
      {actionData && actionData.error && (
        <p className="text-red-500 text-sm mb-2">{actionData.error}</p>
      )}
      {uploadError && (
        <p className="text-red-500 text-sm mb-2">{uploadError}</p>
      )}
      <Dropzone
        onDrop={onDrop}
        uploadProgress={uploadProgress}
        uploadStatus={uploadStatus}
        disabled={uploadStatus === "Complete"}
        filename={filename}
      />
      <form method="post">
        <div className="flex items-center mb-2">
          <label className="w-1/3 block font-bold" htmlFor="title">
            タイトル
          </label>
          <input
            className="w-2/3 appearance-none border-2 border-gray-200 py-2 px-4 rounded"
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
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
        <div className="flex items-center mb-2">
          <label className="w-1/3 block font-bold" htmlFor="registeredAt">
            投稿日
          </label>
          <input
            className="w-2/3 appearance-none border-2 border-gray-200 py-2 px-4 rounded"
            type="datetime-local"
            name="registeredAt"
            id="registeredAt"
            required
          />
        </div>
        <div className="flex mb-2">
          <div className="flex items-center mb-2">
            <label className="w-1/3 block font-bold" htmlFor="viewCount">
              視聴数
            </label>
            <input
              className="w-2/3 appearance-none border-2 border-gray-200 py-2 px-4 rounded"
              type="number"
              min={0}
              name="viewCount"
              id="viewCount"
              required
            />
          </div>
          <div className="flex items-center mb-2">
            <label className="w-1/3 block font-bold" htmlFor="commentCount">
              コメント数
            </label>
            <input
              className="w-2/3 appearance-none border-2 border-gray-200 py-2 px-4 rounded"
              type="number"
              min={0}
              name="commentCount"
              id="commentCount"
              required
            />
          </div>
          <div className="flex items-center mb-2">
            <label className="w-1/3 block font-bold" htmlFor="mylistCount">
              マイリス数
            </label>
            <input
              className="w-2/3 appearance-none border-2 border-gray-200 py-2 px-4 rounded"
              type="number"
              min={0}
              name="mylistCount"
              id="mylistCount"
              required
            />
          </div>
          <div className="flex items-center mb-2">
            <label className="w-1/3 block font-bold" htmlFor="likeCount">
              いいね数
            </label>
            <input
              className="w-2/3 appearance-none border-2 border-gray-200 py-2 px-4 rounded"
              type="number"
              min={0}
              name="likeCount"
              id="likeCount"
              required
            />
          </div>
        </div>
        <div className="flex items-center mb-2">
          <label className="w-1/3 block font-bold" htmlFor="description">
            説明
          </label>
          <textarea
            className="w-2/3 appearance-none border-2 border-gray-200 py-2 px-4 rounded"
            name="description"
            id="description"
            defaultValue={""}
          />
        </div>
        <div className="flex items-center mb-2">
          <label className="w-1/3 block font-bold" htmlFor="shortDescription">
            短い説明
          </label>
          <input
            className="w-2/3 appearance-none border-2 border-gray-200 py-2 px-4 rounded"
            type="text"
            name="shortDescription"
            id="shortDescription"
            defaultValue={""}
          />
        </div>
        <div className="flex items-center mb-2">
          <label className="w-1/3 block font-bold" htmlFor="thumbnailData">
            サムネイル画像データ(jpeg)
          </label>
          <input
            className="w-2/3 appearance-none border-2 border-gray-200 py-2 px-4 rounded"
            type="file"
            name="thumbnailData"
            id="thumbnailData"
            accept="image/jpeg"
            required
          />
        </div>
        <div className="flex mb-2">
          <input type="hidden" name="contentId" value={contentId} required />
          <input type="hidden" name="ownerId" />
          <button
            className="bg-gray-500 text-white font-bold py-2 px-4 rounded"
            type="submit"
            disabled={uploadStatus !== "Complete"}
          >
            送信
          </button>
        </div>
      </form>
    </div>
  );
}
