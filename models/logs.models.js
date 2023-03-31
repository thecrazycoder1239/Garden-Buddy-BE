const db = require("../db");
const { validatePasswordFromRows } = require("../utils/cypto");

exports.validateLogsPassword = ({ log_id, password }) => {
  return db
    .query(
      `
  SELECT hash FROM
  users_plants_logs
    INNER JOIN users_plants
      ON users_plants_logs.users_plant_id = users_plants.users_plant_id
    INNER JOIN users
      ON users_plants.username = users.username
  WHERE users_plants_logs.log_id = $1
  `,
      [log_id]
    )
    .then(({ rows }) => {
      return validatePasswordFromRows({ rows, password, resourceName: "log" });
    });
};

exports.removeLogById = (log_id) => {
  return db.query(
    `
  DELETE FROM users_plants_logs
  WHERE log_id = $1
  `,
    [log_id]
  );
};
