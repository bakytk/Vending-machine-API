const REDIS_HOST: string = process.env.REDIS_HOST;
const REDIS_PORT: string = process.env.REDIS_PORT;

import { createClient, RedisClientOptions, RedisClientType } from "redis";

const factory = (): RedisClientType => {
  return createClient({
    url: `redis://${REDIS_HOST}:${REDIS_PORT}`
  });
};

// import { createClient} from "redis";
// type RedisClientType = ReturnType<typeof createClient>;
// type RedisClientOptions = Parameters<typeof createClient>[0];

// const factory = (options: RedisClientOptions): RedisClientType => {
//   return createClient(options);
// };

export const redisClient: RedisClientType = factory();

// export type RedisClientType = ReturnType<typeof createClient>;
//
// export async function startRedis(): Promise<RedisClientType> {
//   const redis: RedisClientType = createClient({
//     url: `redis://${REDIS_HOST}:${REDIS_PORT}`
//   });
//   await redis.connect();
//   return redis;
// }
