"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.authenticate = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var authenticate = function (secret) { return function (req, res, next) {
    var authHeader = req.headers["authorization"] || "";
    var token = "";
    if (authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7, authHeader.length);
    }
    if (!token) {
        return res.status(401).json({
            error: "No auth header or not Bearer type"
        });
    }
    else {
        jsonwebtoken_1["default"].verify(token, secret, function (err, decode) {
            if (err) {
                return res.status(401).json({ error: "Invalid token" });
            }
            else {
                //console.log("decode", decode);
                req.decode = decode;
                next();
            }
        });
    }
}; };
exports.authenticate = authenticate;
//# sourceMappingURL=auth.js.map