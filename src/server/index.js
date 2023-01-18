const { SERVER_PORT } = process.env;
import express from "express";
const app = express();

import router from "./routes.js";
app.use("/", router);

app.listen(SERVER_PORT, async () => {
  console.log(`Server running on port: ${SERVER_PORT}`);
});
