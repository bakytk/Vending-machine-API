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
var auth_1 = require("./auth");
if (!JWT_SECRET) {
    throw new Error("Missing JWT_SECRET token");
}
var confirmToken = (0, auth_1.authenticate)(JWT_SECRET);
router.get("/alive", controllers_1.controllers.ping);
router.post("/user", controllers_1.controllers.signup);
router.get("/user", controllers_1.controllers.signin);
router.post("/product", confirmToken, controllers_1.controllers.createProduct);
router.get("/product/:id", controllers_1.controllers.getProduct);
router.put("/product/:id", confirmToken, controllers_1.controllers.putProduct);
router["delete"]("/product/:id", confirmToken, controllers_1.controllers.deleteProduct);
router.post("/deposit", confirmToken, controllers_1.controllers.deposit);
router.post("/buy", confirmToken, controllers_1.controllers.buy);
router.post("/reset", confirmToken, controllers_1.controllers.reset);
router.post("/logout/all", confirmToken, controllers_1.controllers.logout);
router.all("/*", controllers_1.controllers.fallback);
router.use(function (error, _, res, __) {
    console.error("Processing err: ".concat(error));
    return res.status(500).json({ error: "Processing error" });
});
exports["default"] = router;
//# sourceMappingURL=routes.js.map