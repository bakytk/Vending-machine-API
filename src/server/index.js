const { SERVER_PORT } = process.env;
import express from "express";
const app = express();

// var router = require('./routes');
// app.use('/', router);

app.listen(SERVER_PORT, async () => {
  console.log(`Server on`);
});
