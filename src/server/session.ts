import MongoStore from "connect-mongo";
import { DB_URL } from "../db/config";
import { uuid } from "uuidv4";

import { COOKIE_NAME } from "./constants";

const sessionStore = MongoStore.create({
  mongoUrl: DB_URL,
  ttl: 20000 //expiry if not in cookie, in sec
});

export const sessionOptions = {
  secret: process.env.SESSION_SECRET as string,
  name: COOKIE_NAME,
  genid: function(req) {
    //console.log("session.id created");
    return uuid(); // use UUIDs for session IDs
  },
  cookie: {
    secure: false, //http vs https
    httpOnly: true, // prevent clientJS read
    maxAge: 1000 * 60 * 30 // in miliseconds
  },
  saveUninitialized: false,
  resave: false,
  store: sessionStore
};
