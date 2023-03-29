const db = require("../db");
const bcrypt = require("bcrypt");
const { validatePasswordFromRows } = require("../utils/cypto");

exports.validateUsersTaskAndPassword = ({ users_task_id, password }) => {
  return db
    .query(
      `
  SELECT hash FROM users_plants_tasks
  INNER JOIN users_plants
    ON users_plants.users_plant_id = users_plants_tasks.users_plant_id
  INNER JOIN users
    ON users.username = users_plants.username
  WHERE users_plants_tasks.users_task_id = $1 
  `,
      [users_task_id]
    )
    .then(({ rows }) => {
     return validatePasswordFromRows({ rows, password, resourceName: "users_task" })
    });
};

exports.removeUsersTaskById = (users_task_id) => {
  return db.query(
    `
  DELETE FROM users_plants_tasks
  WHERE users_task_id = $1
  `,
    [users_task_id]
  );
};
