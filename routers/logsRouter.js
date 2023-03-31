const { deleteLogById } = require("../controllers/logs.controllers");

const logsRouter = require("express").Router();

logsRouter.delete("/:log_id", deleteLogById);

module.exports = logsRouter;
