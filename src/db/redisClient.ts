const REDIS_HOST: string = process.env.REDIS_HOST;
const REDIS_PORT: number = parseInt(process.env.REDIS_PORT);

import redis, { createClient, RedisClientType } from "redis";

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined
});

// console.log("redis", redis);
// console.log("redis.keys: ", Object.keys(redis));

export const redisConnect = async () => {
  await client.connect();
  client
    .on("connect", console.log("Redis connected."))
    .on("error", console.error(`Redis connection error.`));
  return client;
};

// const factory = (): RedisClientType => {
//   const client = createClient({
//     url: `redis://${REDIS_HOST}:${REDIS_PORT}`
//   });
//   client.set("myKey", 123);
//   client.get("myKey", value => {
//     console.log("cb keyValue", value);
//   });
//   //client.connect();
//   return client;
// };

//export const redisClient: RedisClientType = factory();

/*
https://stackoverflow.com/questions/70805943/redis-redis-createclient-in-typescript

  socket: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT)
  },
  password: process.env.REDIS_PW
*/
