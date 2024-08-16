import { connect } from "mongoose";

import type { Mongoose } from "mongoose";

const MONGO_URL = process.env.MONGO_URL;

async function connectMongo(): Promise<Mongoose> {
  const opts = {
    bufferCommands: false,
  };

  if (!MONGO_URL) {
    throw new Error("MONGO_URL is not defined");
  }

  return await connect(MONGO_URL, opts);
}

export default connectMongo;
