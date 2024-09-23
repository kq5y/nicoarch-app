import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import {
  json,
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";

import fs from "fs";

const CONTENTS_DIR =
  process.env.NODE_ENV === "development" ? "./contents" : "/contents";
if (!fs.existsSync(CONTENTS_DIR)) fs.mkdirSync(CONTENTS_DIR);
if (!fs.existsSync(CONTENTS_DIR + "/image"))
  fs.mkdirSync(CONTENTS_DIR + "/image");
if (!fs.existsSync(CONTENTS_DIR + "/image/icon"))
  fs.mkdirSync(CONTENTS_DIR + "/image/icon");
if (!fs.existsSync(CONTENTS_DIR + "/image/thumbnail"))
  fs.mkdirSync(CONTENTS_DIR + "/image/thumbnail");
if (!fs.existsSync(CONTENTS_DIR + "/video"))
  fs.mkdirSync(CONTENTS_DIR + "/video");

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
    directory: CONTENTS_DIR + "/video",
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
