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
  .get(getUsersPlantById)
  .delete(deleteUsersPlantById)
  .patch(patchUsersPlantById);

module.exports = usersPlantsRouter;
