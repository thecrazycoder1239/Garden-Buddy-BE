const express = require("express");
const app = express();
const {
  handlePSQLerrors,
  handleCustomErrors,
} = require("./controllers/error-handler");

app.use(express.json());

const apiRouter = require("./routers/apiRouter");

app.use("/api", apiRouter);

app.use(handlePSQLerrors);
app.use(handleCustomErrors);

app.use((err, req, res, next) => {
  console.log(req.method, req.url);
  console.error(err);
  res.sendStatus(500);
});

module.exports = app;
