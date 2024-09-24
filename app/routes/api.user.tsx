import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import { writeFile } from "fs/promises";

import User from "~/models/User";
import { CONTENTS_DIR } from "~/utils/contents";
import connectMongo from "~/utils/mongo";

import type { UserType } from "~/@types/models";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  if (!userId || isNaN(Number(userId))) {
    return json(
      {
        meta: {
          status: 400,
          errorCode: "MISSING_USER_ID",
        },
      },
      400
    );
  }
  const user = await User.findOne({ where: { userId: Number(userId) } }).lean();
  if (!user) {
    return json(
      {
        meta: {
          status: 404,
          errorCode: "USER_NOT_FOUND",
        },
      },
      404
    );
  }
  return json(
    {
      meta: {
        status: 200,
      },
      data: user,
    },
    200
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
  const formData = await request.formData();
  if (
    !formData.has("userId") ||
    !formData.has("nickname") ||
    !formData.has("description") ||
    !formData.has("registeredVersion") ||
    !formData.has("contentId") ||
    !formData.has("iconData")
  ) {
    return json(
      {
        meta: {
          status: 400,
          errorCode: "MISSING_REQUIRED_FIELDS",
        },
      },
      400
    );
  }
  try {
    const iconDataBuffer = Buffer.from(
      await (formData.get("iconData") as File).arrayBuffer()
    );
    await writeFile(
      CONTENTS_DIR + "/image/icon/" + formData.get("contentId") + ".jpg",
      iconDataBuffer
    );
  } catch (error) {
    return json(
      {
        meta: {
          status: 500,
          errorCode: "FAILED_TO_SAVE_ICON",
        },
      },
      500
    );
  }
  const userObject: UserType = {
    userId: Number(formData.get("userId") as string),
    nickname: formData.get("nickname") as string,
    description: formData.get("description") as string,
    registeredVersion: formData.get("registeredVersion") as string,
    contentId: formData.get("contentId") as string,
  };
  try {
    await connectMongo();
    const user = await User.create(userObject);
    return json(
      {
        meta: {
          status: 201,
        },
        data: user.toObject(),
      },
      201
    );
  } catch (error) {
    return json(
      {
        meta: {
          status: 500,
          errorCode: "FAILED_TO_CREATE_USER",
        },
      },
      500
    );
  }
};
