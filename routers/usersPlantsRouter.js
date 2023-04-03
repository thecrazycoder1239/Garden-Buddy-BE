const usersPlantsRouter = require("express").Router();
const {
  postTaskToUsersPlantsTasks,
  getUsersPlantById,
  deleteUsersPlantById,
  patchUsersPlantById,
  postLogToUsersPlantsLogs,
} = require("../controllers/users-plants.controllers");

usersPlantsRouter.post("/:users_plant_id/tasks", postTaskToUsersPlantsTasks);

usersPlantsRouter.post("/:users_plant_id/logs", postLogToUsersPlantsLogs);

usersPlantsRouter
  .route("/:users_plant_id")
  .delete(deleteUsersPlantById)
  .patch(patchUsersPlantById);

usersPlantsRouter.post("/:users_plant_id/access", getUsersPlantById)

module.exports = usersPlantsRouter;
