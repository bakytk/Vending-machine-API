
const { JWT_SECRET } = process.env;
const {
  authenticate,
  fetch,
  create,
  ping,
  fallback
} = require('./controllers');
const { authVerify } = require("./auth");
const express = require('express');
const router = express.Router();
const bodyParser= require('body-parser')

//check cors?
router.use(bodyParser.json());

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET env");
};
const confirmToken = authVerify(JWT_SECRET);

router.post("/auth", authenticate);
router.get("/alive", ping);
router.get("/movies", confirmToken, fetch);
router.post("/movies", confirmToken, create);
router.all("/*", fallback);
router.use((error, _, res, __) => {
  console.error(`Processing err: ${error}`);
  return res.status(500).json({ error: "Processing error" });
});

module.exports = router;
