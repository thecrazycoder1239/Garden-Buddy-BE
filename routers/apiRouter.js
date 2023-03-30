const apiRouter = require("express").Router();
const usersRouter = require("./usersRouter");
const usersPlantsRouter = require("./usersPlantsRouter");
const usersTasksRouter = require("./usersTasksRouter");
const logsRouter = require("./logsRouter");

apiRouter.use("/users", usersRouter);

apiRouter.use("/users-plants", usersPlantsRouter);

apiRouter.use("/users-tasks", usersTasksRouter);

apiRouter.use("/logs", logsRouter);

module.exports = apiRouter;
