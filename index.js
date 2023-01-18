const { NODE_PORT } = process.env;

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

const routes = require("./src/routes/apiRoutes");
routes(app);

app.use((err, request, response, next) => {
  //console.error(err);
  const status = err.status || 500;
  response.status(status);
  response.render("Error");
});

app.listen(NODE_PORT, function() {
  console.log("Server started.");
});
