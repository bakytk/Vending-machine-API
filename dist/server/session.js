"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.sessionOptions = void 0;
var connect_mongo_1 = __importDefault(require("connect-mongo"));
var config_1 = require("../db/config");
var uuidv4_1 = require("uuidv4");
var constants_1 = require("./constants");
var sessionStore = connect_mongo_1["default"].create({
    mongoUrl: config_1.DB_URL,
    ttl: 20000 //expiry if not in cookie, in sec
});
exports.sessionOptions = {
    secret: process.env.SESSION_SECRET,
    name: constants_1.COOKIE_NAME,
    genid: function (req) {
        //console.log("session.id created");
        return (0, uuidv4_1.uuid)(); // use UUIDs for session IDs
    },
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 30 // in miliseconds
    },
    saveUninitialized: false,
    resave: false,
    store: sessionStore
};
//# sourceMappingURL=session.js.map