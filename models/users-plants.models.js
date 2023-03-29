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

exports.selectUsersPlantById = (users_plant_id) => {
  return db
    .query(
      `
  SELECT * FROM users_plants
  LEFT OUTER JOIN users_plants_tasks
    ON users_plants.users_plant_id = users_plants_tasks.users_plant_id
  WHERE users_plants.users_plant_id = $1
  ORDER BY users_task_id
  `,
      [users_plant_id]
    )
    .then(({ rows }) => {
      const tasks = [];

      rows.forEach((row) => {
        if (row.users_task_id) {
          tasks.push({
            users_task_id: row.users_task_id,
            users_plant_id: row.users_plant_id,
            task_slug: row.task_slug,
            task_start_date: row.task_start_date,
          });
        }
      });

      return {
        users_plant_id: +users_plant_id,
        planted_date: rows[0].planted_date,
        plant_id: rows[0].plant_id,
        username: rows[0].username,
        tasks,
      };
    });
};
