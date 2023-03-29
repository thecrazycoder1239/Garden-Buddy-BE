const {
  deleteUsersTaskById,
} = require("../controllers/users-tasks.controllers");

const usersTasksRouter = require("express").Router();

usersTasksRouter.route("/:users_task_id").delete(deleteUsersTaskById);

module.exports = usersTasksRouter;
