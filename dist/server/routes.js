"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var JWT_SECRET = process.env.JWT_SECRET || "";
var express_1 = __importDefault(require("express"));
var router = express_1["default"].Router();
var body_parser_1 = __importDefault(require("body-parser"));
router.use(body_parser_1["default"].json());
var controllers_1 = require("./controllers");
//import { authenticate } from "./auth";
if (!JWT_SECRET) {
    throw new Error("Missing JWT_SECRET token");
}
//const confirmToken = authenticate(JWT_SECRET);
//router.post("/auth", authenticate);
router.get("/alive", controllers_1.controllers.ping);
router.post("/user", controllers_1.controllers.signup);
// router.get("/user", controllers.signin);
//
// router.get("/product", controllers.getProduct);
// router.post("/product", confirmToken, controllers.createProduct);
// router.put("/product", confirmToken, controllers.putProduct);
// router.delete("/product", confirmToken, controllers.deleteProduct);
//
// router.post("/deposit", confirmToken, controllers.deposit);
// router.post("/buy", confirmToken, controllers.buy);
// router.post("/reset", confirmToken, controllers.reset);
// router.post("/logout/all", confirmToken, controllers.logout);
router.all("/*", controllers_1.controllers.fallback);
router.use(function (error, _, res, __) {
    console.error("Processing err: ".concat(error));
    return res.status(500).json({ error: "Processing error" });
});
exports["default"] = router;
//# sourceMappingURL=routes.js.map