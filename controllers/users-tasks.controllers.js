const {
  removeUsersTaskById,
  validateUsersTaskAndPassword,
  updateUsersTaskById,
} = require("../models/users-tasks.models");

exports.deleteUsersTaskById = (req, res, next) => {
  const { users_task_id } = req.params;
  const { password } = req.body;

  validateUsersTaskAndPassword({ users_task_id, password })
    .then(() => {
      return removeUsersTaskById(users_task_id);
    })
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};

exports.patchUsersTaskById = (req, res, next) => {
  const { users_task_id } = req.params;
  const { password, task_slug, task_start_date } = req.body;

  validateUsersTaskAndPassword({ users_task_id, password })
    .then(() => {
      return updateUsersTaskById({ users_task_id, task_slug, task_start_date });
    })
    .then((task) => {
      res.status(200).send({ task });
    })
    .catch(next);
};
