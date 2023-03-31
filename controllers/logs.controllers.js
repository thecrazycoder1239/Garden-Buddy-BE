const {
  removeLogById,
  validateLogsPassword,
} = require("../models/logs.models");

exports.deleteLogById = (req, res, next) => {
  const { log_id } = req.params;
  const { password } = req.body;

  validateLogsPassword({ log_id, password })
    .then(() => {
      return removeLogById(log_id);
    })
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
