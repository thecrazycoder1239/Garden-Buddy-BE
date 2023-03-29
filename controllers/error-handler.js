exports.handlePSQLerrors = (error, request, response, next) => {
  if (error.code === "23505") {
    response.status(409).send({ msg: "Username already exists!" });
  } else if (error.code === "22001") {
    response
      .status(400)
      .send({ msg: "Username too long, maximum 30 characters!" });
  } else if (error.code === "23502") {
    response.status(400).send({ msg: "Missing required field" });
  } else if (["22008", "22007"].includes(error.code)) {
    response.status(400).send({ msg: "Invalid date" });
  } else if (error.code === "22P02") {
    response.status(400).send({ msg: "Invalid plant id" });
  } else next(error);
};

exports.handleCustomErrors = (error, request, response, next) => {
  if (error.msg === "forbidden") {
    response.sendStatus(403);
  } else if (error.msg) {
    if (error.msg.endsWith("not found")) {
      response.status(404).send({ msg: error.msg });
    } else {
      response.status(400).send({ msg: error.msg });
    }
  } else next(error);
};
