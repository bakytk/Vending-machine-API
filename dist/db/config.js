"use strict";
exports.__esModule = true;
exports.DB_URL = void 0;
var DB_USER = process.env.DB_USER;
var DB_PWD = process.env.DB_PWD;
var DB_HOST = process.env.DB_HOST;
var DB_PORT = process.env.DB_PORT;
var DB_NAME = process.env.DB_NAME;
exports.DB_URL = "mongodb://".concat(DB_USER, ":").concat(DB_PWD, "@") +
    "".concat(DB_HOST, ":").concat(DB_PORT, "/").concat(DB_NAME, "?authSource=admin");
//# sourceMappingURL=config.js.map