const { insertUser } = require('../models/users.models')

exports.postUser = (req, res, next) => {

  const { username, first_name, last_name, password } = req.body
  
  insertUser({username, first_name, last_name, password})
    .then((user) => {
      res.status(201);
      res.send({user: user})
    })
    .catch(next)

}