import dotenv from "dotenv";
dotenv.config();

const SERVER_PORT: number = Number(process.env.SERVER_PORT) || 15500;
const SESS_SECRET: string = process.env.SESS_SECRET;

import express from "express";
const app = express();

import { uuid } from "uuidv4";
import session from "express-session";
import router from "./routes";

app.use(
  session({
    secret: SESS_SECRET,
    genid: function(req) {
      console.log("session.id created");
      return uuid(); // use UUIDs for session IDs
    },
    name: "vendingSession",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, //http vs https
      httpOnly: true, // prevent clientJS read
      maxAge: 1000 * 60 * 30 // in miliseconds
    }
  })
);

app.use("/", router);

app.listen(SERVER_PORT, async () => {
  console.log(`Server running on port: ${SERVER_PORT}`);
});

export default app;
