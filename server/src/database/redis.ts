import { createClient } from "redis";
// Resolves the undefined typing issue by establishing a local fallback
const redisUrl = process.env.REDIS_URI;

if (!redisUrl) {
  throw new Error("REDIS_URL is not defined");
}

export const redisClient = createClient({
  url: redisUrl,
});

redisClient.on("error", (err) => {
  console.log("Redis client error", err);
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("✅ Redis connected successfully.");
  } catch (error) {
    throw error;
  }
};
