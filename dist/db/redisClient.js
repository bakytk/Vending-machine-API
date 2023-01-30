"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.redisClient = void 0;
var REDIS_HOST = process.env.REDIS_HOST;
var REDIS_PORT = parseInt(process.env.REDIS_PORT);
var redis_1 = __importDefault(require("redis"));
exports.redisClient = redis_1["default"].createClient({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASS || undefined
});
console.log("redis", redis_1["default"]);
console.log("redis.keys: ", Object.keys(redis_1["default"]));
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
//# sourceMappingURL=redisClient.js.map