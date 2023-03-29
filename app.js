const express = require("express");
const cors = require("cors");
const app = express();
const { 
  addSubscription,
  removeSubscription,
 } = require("./controllers/push-subscription.controllers");
const {
  handlePSQLerrors,
  handleCustomErrors,
} = require("./controllers/error-handler");
const apiRouter = require("./routers/apiRouter");
const compositeHandler = require("./controllers/composite-handler");

app.use(cors())

app.use(express.json());

app.use("/api", apiRouter);

app.post("/add-subscription", addSubscription)
app.post("/remove-subscription", removeSubscription)

app.post("/composite", compositeHandler);

app.use(handlePSQLerrors);
app.use(handleCustomErrors);

app.use((err, req, res, next) => {
  console.log(req.method, req.url);
  console.error(err);
  res.sendStatus(500);
});

module.exports = app;
