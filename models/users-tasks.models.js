const db = require("../db");
const bcrypt = require("bcrypt");

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
      if (!rows.length) {
        return Promise.reject({ msg: "users_task not found" });
      }

      if (!password) {
        return Promise.reject({ msg: "empty password field" });
      }

      const { hash } = rows[0];

      return bcrypt.compare(password, hash);
    })
    .then((result) => {
      if (!result) {
        return Promise.reject({ msg: "forbidden" });
      }
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
