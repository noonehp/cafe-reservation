import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: 3,
  lazyConnect: false,
});

export async function checkRedisConnection() {
  const pong = await redis.ping();
  return { ok: pong === "PONG" };
}
