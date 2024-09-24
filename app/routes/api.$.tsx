import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  return json(
    {
      meta: {
        status: 404,
        errorCode: "NOT_FOUND",
      },
    },
    404
  );
};

export const action: ActionFunction = async () => {
  return json(
    {
      meta: {
        status: 404,
        errorCode: "NOT_FOUND",
      },
    },
    404
  );
};
