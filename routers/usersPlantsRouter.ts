const usersPlantsRouter = require('express').Router();
const {
  postTaskToUsersPlantsTasks,
} = require('../controllers/users-plants.controllers')

usersPlantsRouter.post("/:users_plant_id/tasks", postTaskToUsersPlantsTasks)

module.exports = usersPlantsRouter;