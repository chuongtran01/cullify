import "server-only";

import { createClient, type RedisClientType } from "redis";

const globalForRedis = globalThis as unknown as {
  redis: RedisClientType | undefined;
  redisConnection: Promise<RedisClientType> | undefined;
};

function createRedisClient() {
  const url = process.env.REDIS_URL;

  if (!url) {
    throw new Error("REDIS_URL is not set");
  }

  const client = createClient({ url });

  client.on("error", (error) => {
    console.error("Redis client error", error);
  });

  return client as RedisClientType;
}

export async function getRedis() {
  const client = globalForRedis.redis ?? createRedisClient();
  globalForRedis.redis = client;

  if (!client.isOpen) {
    globalForRedis.redisConnection ??= client.connect().then(() => client);

    try {
      await globalForRedis.redisConnection;
    } catch (error) {
      globalForRedis.redisConnection = undefined;
      throw error;
    }
  }

  return client;
}
