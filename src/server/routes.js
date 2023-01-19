const { JWT_SECRET } = process.env;

import express from "express";
const router = express.Router();

import bodyParser from "body-parser";
router.use(bodyParser.json());

import { controllers } from "./controllers.js";
import { authenticate } from "./auth.js";

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET token");
}
const confirmToken = authenticate(JWT_SECRET);

//router.post("/auth", authenticate);
router.get("/alive", controllers.ping);
router.post("/user", controllers.signup);
router.get("/user", controllers.signin);

router.get("/product", controllers.getProduct);
router.post("/product", confirmToken, controllers.createProduct);
router.put("/product", confirmToken, controllers.putProduct);
router.delete("/product", confirmToken, controllers.deleteProduct);
//router.post("/movies", create);
router.all("/*", controllers.fallback);
router.use((error, _, res, __) => {
  console.error(`Processing err: ${error}`);
  return res.status(500).json({ error: "Processing error" });
});

export default router;
