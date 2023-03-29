const usersRouter = require("express").Router();
const {
  postUser,
  getUserByUsername,
  deleteUserByUsername,
  postPlantToUser,
  getUsersPlantsByUsername,
} = require("../controllers/users.controllers");

usersRouter.post("/", postUser);

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .delete(deleteUserByUsername);

usersRouter
  .route("/:username/plants")
  .post(postPlantToUser)
  .get(getUsersPlantsByUsername);

module.exports = usersRouter;
