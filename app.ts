const express = require('express');
const app = express();

app.use(express.json())

const apiRouter = require('./routers/apiRouter')

app.use('/api', apiRouter)

app.use((err, req, res, next) => {
  console.error(err);
  res.sendStatus(500)
})

module.exports = app;