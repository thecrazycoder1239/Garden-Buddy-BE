const {
  insertTaskIntoUsersPlantsTasks,
  validateUsersPlantPassword
} = require('../models/users-plants.models')

exports.postTaskToUsersPlantsTasks = (req, res, next) => {
  const { users_plant_id } = req.params;
  const { password, task_slug, task_start_date } = req.body;

  validateUsersPlantPassword({ users_plant_id, password })
  .then(() => {
      return insertTaskIntoUsersPlantsTasks({ users_plant_id, task_slug, task_start_date })
    })
    .then(task => {
      res.status(201).send({ task: task })
    })
    .catch(next)
}