import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import {
  json,
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";

import fs from "fs";

if (!fs.existsSync("/contents")) fs.mkdirSync("/contents");
if (!fs.existsSync("/contents/image")) fs.mkdirSync("/contents/image");
if (!fs.existsSync("/contents/image/icon"))
  fs.mkdirSync("/contents/image/icon");
if (!fs.existsSync("/contents/image/thumbnail"))
  fs.mkdirSync("/contents/image/thumbnail");
if (!fs.existsSync("/contents/video")) fs.mkdirSync("/contents/video");

export const loader: LoaderFunction = async () => {
  return json(
    {
      errorCode: "METHOD_NOT_ALLOWED",
    },
    405
  );
};

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json(
      {
        errorCode: "METHOD_NOT_ALLOWED",
      },
      405
    );
  }
  const url = new URL(request.url);
  const assetId = url.searchParams.get("assetId");
  if (!assetId) {
    return json(
      {
        errorCode: "MISSING_ASSET_ID",
      },
      400
    );
  }
  const uploadHandler = unstable_createFileUploadHandler({
    maxPartSize: 5 * 1024 * 1024 * 1024,
    directory: "/contents/video",
    file: () => `${assetId}.mp4`,
  });
  try {
    const formData = await unstable_parseMultipartFormData(
      request,
      uploadHandler
    );
    const file = formData.get("file");
    if (!file) {
      return json(
        {
          errorCode: "MISSING_FILE",
        },
        400
      );
    }
    return json(
      {
        assetId,
      },
      200
    );
  } catch (error) {
    return json(
      {
        errorCode: "UPLOAD_FAILED",
      },
      500
    );
  }
};
