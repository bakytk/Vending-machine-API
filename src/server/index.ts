import dotenv from "dotenv";
dotenv.config();

const SERVER_PORT: number = Number(process.env.SERVER_PORT) || 15500;
const SESS_SECRET: string = process.env.SESS_SECRET;

import express, { Application, Request, Response } from "express";
import router from "./routes";
import { sessionOptions } from "./session";
import session from "express-session";

import { promises as fs } from "fs";
fs.readdir("dist").then(result => {
  console.log("folder.content", result);
});

const app: Application = express();
app.use(session(sessionOptions));
app.use("/", router);

app.listen(SERVER_PORT, async () => {
  console.log(`Server running on port: ${SERVER_PORT}`);
});

export default app;
