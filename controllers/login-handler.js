const {
  validateUserPassword,
  selectUserByUsername,
} = require("../models/users.models");

exports.handleLogin = (req, res, next) => {
  const { username, password } = req.body;

  validateUserPassword({ username, password })
    .then(() => {
      return selectUserByUsername(username);
    })
    .then((user) => {
      res.status(200).send({
        user: {
          ...user,
          password,
        },
      });
    })
    .catch(next);
};
