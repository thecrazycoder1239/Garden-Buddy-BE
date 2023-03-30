const {
  insertTaskIntoUsersPlantsTasks,
  validateUsersPlantPassword,
  selectUsersPlantById,
  removeUsersPlantById,
  updateUsersPlantById,
  insertLogIntoUsersPlantsLogs,
} = require("../models/users-plants.models");

exports.postTaskToUsersPlantsTasks = (req, res, next) => {
  const { users_plant_id } = req.params;
  const { password, task_slug, task_start_date } = req.body;

  validateUsersPlantPassword({ users_plant_id, password })
    .then(() => {
      return insertTaskIntoUsersPlantsTasks({
        users_plant_id,
        task_slug,
        task_start_date,
      });
    })
    .then((task) => {
      res.status(201).send({ task: task });
    })
    .catch(next);
};

exports.getUsersPlantById = (req, res, next) => {
  const { users_plant_id } = req.params;
  const { password } = req.body;

  validateUsersPlantPassword({ users_plant_id, password })
    .then(() => {
      return selectUsersPlantById(users_plant_id);
    })
    .then((plant) => {
      res.status(200).send({ plant });
    })
    .catch(next);
};

exports.deleteUsersPlantById = (req, res, next) => {
  const { users_plant_id } = req.params;
  const { password } = req.body;

  validateUsersPlantPassword({ users_plant_id, password })
    .then(() => {
      return removeUsersPlantById(users_plant_id);
    })
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};

exports.patchUsersPlantById = (req, res, next) => {
  const { users_plant_id } = req.params;
  const { password, planted_date } = req.body;

  validateUsersPlantPassword({ users_plant_id, password })
    .then(() => {
      return updateUsersPlantById({ users_plant_id, planted_date });
    })
    .then(() => {
      return selectUsersPlantById(users_plant_id);
    })
    .then((plant) => {
      res.status(200).send({ plant });
    })
    .catch(next);
};

exports.postLogToUsersPlantsLogs = (req, res, next) => {
  const { users_plant_id } = req.params;
  const { password, body } = req.body;

  validateUsersPlantPassword({ users_plant_id, password })
    .then(() => {
      return insertLogIntoUsersPlantsLogs({ users_plant_id, body });
    })
    .then((log) => {
      res.status(201).send({ log });
    })
    .catch(next);
};
