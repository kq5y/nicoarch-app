import { Redis } from "ioredis";

const REDIS_URL = process.env.REDIS_URL;

function connectRedis() {
  if (!REDIS_URL) {
    throw new Error("REDIS_URL is not defined");
  }

  return new Redis(REDIS_URL, { db: 0 });
}

export default connectRedis;
