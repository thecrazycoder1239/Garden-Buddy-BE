const {
  postUser,
  getUserByUsername,
  deleteUserByUsername,
  postPlantToUser,
} = require("../controllers/users.controllers");
const usersRouter = require("express").Router();

usersRouter.post("/", postUser);

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .delete(deleteUserByUsername);

usersRouter.route("/:username/plants").post(postPlantToUser);

module.exports = usersRouter;
