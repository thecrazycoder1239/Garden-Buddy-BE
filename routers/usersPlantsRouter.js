const usersPlantsRouter = require("express").Router();
const {
  postTaskToUsersPlantsTasks, 
  getUsersPlantById,
} = require("../controllers/users-plants.controllers");

usersPlantsRouter.post("/:users_plant_id/tasks", postTaskToUsersPlantsTasks);

usersPlantsRouter.get("/:users_plant_id", getUsersPlantById)

module.exports = usersPlantsRouter;
