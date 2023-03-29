const { insertSubscription, deleteSubscription } = require('../models/push-subscription.models');
const { validateUserPassword } = require('../models/users.models')

exports.addSubscription = (req, res, next) => {
  const { body } = req;

  const { user, pushSubscription } = body;

  validateUserPassword(user)
    .then(() => {
      return insertSubscription({ username: user.username, pushSubscription })
    })
    .then(() => {
      res.sendStatus(200)
    })
    .catch(next)
}

exports.removeSubscription = (req, res, next) => {
  const { pushSubscription } = req.body;

  deleteSubscription({ pushSubscription })
    .catch(next)
}