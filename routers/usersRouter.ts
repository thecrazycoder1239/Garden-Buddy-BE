const usersRouter = require("express").Router();
const {
  postUser,
  getUserByUsername,
  deleteUserByUsername,
} = require("../controllers/users.controllers");

usersRouter.post("/", postUser);

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .delete(deleteUserByUsername);

module.exports = usersRouter;
