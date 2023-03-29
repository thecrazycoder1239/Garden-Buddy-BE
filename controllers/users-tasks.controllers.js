const {
  removeUsersTaskById,
  validateUsersTaskAndPassword,
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
