import dotenv from "dotenv";
dotenv.config();

const SERVER_PORT: number = Number(process.env.SERVER_PORT) || 15500;
const REDIS_SECRET: string = process.env.REDIS_SECRET;

import express from "express";
const app = express();

import session from "express-session";
import router from "./routes";
app.use("/", router);

//Configure session middleware
app.use(
  session({
    //store: new RedisStore({ client: redisClient }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // if true only transmit cookie over https
      httpOnly: true, // if true prevent client side JS from reading the cookie
      maxAge: 1000 * 60 * 30 // session max age in miliseconds
    }
  })
);

app.listen(SERVER_PORT, async () => {
  console.log(`Server running on port: ${SERVER_PORT}`);
});

export default app;
