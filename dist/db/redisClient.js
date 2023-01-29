"use strict";
exports.__esModule = true;
exports.redisClient = void 0;
var REDIS_HOST = process.env.REDIS_HOST;
var REDIS_PORT = process.env.REDIS_PORT;
var redis_1 = require("redis");
var factory = function () {
    return (0, redis_1.createClient)({
        url: "redis://".concat(REDIS_HOST, ":").concat(REDIS_PORT)
    });
};
// import { createClient} from "redis";
// type RedisClientType = ReturnType<typeof createClient>;
// type RedisClientOptions = Parameters<typeof createClient>[0];
// const factory = (options: RedisClientOptions): RedisClientType => {
//   return createClient(options);
// };
exports.redisClient = factory();
// export type RedisClientType = ReturnType<typeof createClient>;
//
// export async function startRedis(): Promise<RedisClientType> {
//   const redis: RedisClientType = createClient({
//     url: `redis://${REDIS_HOST}:${REDIS_PORT}`
//   });
//   await redis.connect();
//   return redis;
// }
//# sourceMappingURL=redisClient.js.map