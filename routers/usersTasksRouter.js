const {
  deleteUsersTaskById,
  patchUsersTaskById,
} = require("../controllers/users-tasks.controllers");

const usersTasksRouter = require("express").Router();

usersTasksRouter
  .route("/:users_task_id")
  .delete(deleteUsersTaskById)
  .patch(patchUsersTaskById);

module.exports = usersTasksRouter;
