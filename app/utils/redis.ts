import redis from "redis";

const REDIS_URL = process.env.REDIS_URL;

async function connectRedis() {
  if (!REDIS_URL) {
    throw new Error("REDIS_URL is not defined");
  }

  return redis.createClient({
    url: REDIS_URL,
  });
}

export default connectRedis;
