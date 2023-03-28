const usersRouter = require('express').Router();
const { postUser } = require('../controllers/users.controllers')

usersRouter.post('/', postUser)

module.exports = usersRouter;