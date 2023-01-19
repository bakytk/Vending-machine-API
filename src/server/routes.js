const { JWT_SECRET } = process.env;
import { controllers } from "./controllers.js";
//const { authVerify } = require("./auth");
import express from "express";
const router = express.Router();

import bodyParser from "body-parser";
router.use(bodyParser.json());

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET token");
}
//const confirmToken = authVerify(JWT_SECRET);

//router.post("/auth", authenticate);
router.get("/alive", controllers.ping);
router.post("/user", controllers.signup);
//router.get("/user", controllers.signin);
//router.get("/movies", fetch); //confirmToken,
//router.post("/movies", create);
router.all("/*", controllers.fallback);
router.use((error, _, res, __) => {
  console.error(`Processing err: ${error}`);
  return res.status(500).json({ error: "Processing error" });
});

export default router;
