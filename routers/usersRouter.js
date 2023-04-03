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

usersRouter.post("/:username/plants", postPlantToUser);

usersRouter.post("/:username/plants/access",getUsersPlantsByUsername)

module.exports = usersRouter;
