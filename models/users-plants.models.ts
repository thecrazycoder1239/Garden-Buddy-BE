const db = require("../db/");
const bcrypt = require("bcrypt");

exports.validateUsersPlantPassword = ({ users_plant_id, password }) => {
  return db
    .query(
      `
  SELECT hash FROM 
  users_plants
    INNER JOIN users
      ON users_plants.username = users.username
  WHERE users_plants.users_plant_id = $1
  `,
      [users_plant_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ msg: "plant not found" });
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

exports.insertTaskIntoUsersPlantsTasks = ({
  users_plant_id,
  task_slug,
  task_start_date,
}) => {
  return db
    .query(
      `
  INSERT INTO users_plants_tasks
    (users_plant_id, task_slug, task_start_date)
  VALUES
    ($1, $2, $3)
  RETURNING *;
  `,
      [users_plant_id, task_slug, task_start_date]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
