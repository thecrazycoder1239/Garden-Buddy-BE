exports.handlePSQLerrors = (error, request, response, next) => {
    if (error.code === "23505") {
      response.status(409).send({ msg: "Username already exists!" });
    } else if (error.code === "22001") {
      response.status(400).send({ msg: "Username too long, maximum 30 characters!" });
    } else next(error);
 };

 exports.handleCustomErrors = (error, request, response, next) => {
  if (error.msg === 'forbidden') {
    response.sendStatus(403)
  } else if (error.msg) {
    if (error.msg.endsWith('not found')) {
      response.status(404).send({msg: error.msg})
    } else {
      response.status(400).send({msg: error.msg})
    }
  } else next(error)
 }

