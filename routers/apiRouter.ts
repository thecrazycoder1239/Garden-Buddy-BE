const apiRouter = require("express").Router();
const usersRouter = require("./usersRouter");
const usersPlantsRouter = require("./usersPlantsRouter");

apiRouter.use("/users", usersRouter);

apiRouter.use("/users-plants", usersPlantsRouter);

module.exports = apiRouter;
