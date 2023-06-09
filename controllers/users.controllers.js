const { combineUsersPlantWithGrowstuffData } = require("../models/grow-stuff.models");
const {
  insertUser,
  selectUserByUsername,
  removeUserByUsername,
  validateUserPassword,
  insertPlantToUser,
  selectUsersPlantsByUsername,
  updateUserFirstName,
  updateUserLastName,
} = require("../models/users.models");

exports.postUser = (req, res, next) => {
  const { username, first_name, last_name, password } = req.body;

  insertUser({ username, first_name, last_name, password })
    .then((user) => {
      res.status(201).send({ user: user });
    })
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;

  selectUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user: user });
    })
    .catch(next);
};

exports.deleteUserByUsername = (req, res, next) => {
  const { username } = req.params;
  const { password } = req.body;

  validateUserPassword({ username, password })
    .then(() => {
      return removeUserByUsername(username);
    })
    .then((user) => {
      res.sendStatus(204);
    })
    .catch(next);
};

exports.postPlantToUser = (req, res, next) => {
  const { username } = req.params;
  const { password, plant_id, planted_date } = req.body;

  validateUserPassword({ username, password })
    .then(() => {
      return insertPlantToUser({ username, plant_id, planted_date });
    })
    .then((plant) => {
      return combineUsersPlantWithGrowstuffData(plant)
    })
    .then((plant) => {
      res.status(201).send({ plant: plant });
    })
    .catch(next);
};

exports.getUsersPlantsByUsername = (req, res, next) => {
  const { username } = req.params;
  const { password } = req.body;
  validateUserPassword({ username, password })
    .then(() => {
      return selectUsersPlantsByUsername(username);
    })
    .then((plants) => {
      return Promise.all(
        plants.map(combineUsersPlantWithGrowstuffData)
      )
    })
    .then((plants) => {
      res.status(200).send({ plants });
    })
    .catch(next);
};

exports.patchUserFirstName = (req, res, next) => {
  const { username } = req.params;
  const { first_name, last_name, password } = req.body;

  validateUserPassword({ username, password })
    .then(() => {
      if (first_name !== undefined) {
        return updateUserFirstName(username, first_name);
      } else if (last_name !== undefined) {
        return updateUserLastName(username, last_name)
      } else {
        res.status(400).send({ msg: "bad request" });
      }
    })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch(next);
};
