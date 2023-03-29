const usersPlantsRouter = require("express").Router();
const {
  postTaskToUsersPlantsTasks,
  getUsersPlantById,
  deleteUsersPlantById,
} = require("../controllers/users-plants.controllers");

usersPlantsRouter.post("/:users_plant_id/tasks", postTaskToUsersPlantsTasks);

usersPlantsRouter
  .route("/:users_plant_id")
  .get(getUsersPlantById)
  .delete(deleteUsersPlantById);

module.exports = usersPlantsRouter;
