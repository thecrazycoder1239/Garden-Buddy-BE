const db = require("../db/");
const bcrypt = require("bcrypt");
const { validatePasswordFromRows } = require("../utils/cypto");

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
      return validatePasswordFromRows({
        rows,
        password,
        resourceName: "users_plant",
      });
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
  SELECT users_plants.users_plant_id, planted_date, plant_id, username,
    users_task_id, task_slug, task_start_date,
    NULL AS log_id, NULL AS body, NULL AS log_date
  FROM users_plants
  LEFT OUTER JOIN users_plants_tasks
    ON users_plants.users_plant_id = users_plants_tasks.users_plant_id
  WHERE users_plants.users_plant_id = $1
  UNION
  SELECT users_plants.users_plant_id, planted_date, plant_id, username,
    NULL AS users_task_id, NULL AS task_slug, NULL AS task_start_date,
    log_id, body, log_date
  FROM users_plants
  LEFT OUTER JOIN users_plants_logs
    ON users_plants.users_plant_id = users_plants_logs.users_plant_id
  WHERE users_plants.users_plant_id = $1
  ORDER BY users_task_id, log_id
  `,
      [users_plant_id]
    )
    .then(({ rows }) => {
      const tasks = [];
      const logs = [];

      rows.forEach((row) => {
        //These conditions are mutually exclusive due to the above query
        if (row.users_task_id) {
          tasks.push({
            users_task_id: row.users_task_id,
            users_plant_id: row.users_plant_id,
            task_slug: row.task_slug,
            task_start_date: row.task_start_date,
          });
        } else if (row.log_id) {
          logs.push({
            log_id: row.log_id,
            body: row.body,
            users_plant_id: row.users_plant_id,
            log_date: row.log_date,
          });
        }
      });

      return {
        users_plant_id: +users_plant_id,
        planted_date: rows[0].planted_date,
        plant_id: rows[0].plant_id,
        username: rows[0].username,
        tasks,
        logs,
      };
    });
};

exports.removeUsersPlantById = (users_plant_id) => {
  return db.query(
    `
  DELETE FROM users_plants
  WHERE users_plant_id = $1
  `,
    [users_plant_id]
  );
};

exports.updateUsersPlantById = ({ users_plant_id, planted_date }) => {
  return db.query(
    `
  UPDATE users_plants
  SET planted_date = $1
  WHERE users_plant_id = $2
  `,
    [planted_date, users_plant_id]
  );
};

exports.insertLogIntoUsersPlantsLogs = ({ users_plant_id, body }) => {
  return db
    .query(
      `
  INSERT INTO users_plants_logs
    (users_plant_id, body)
  VALUES
    ($1, $2)
  RETURNING *
  `,
      [users_plant_id, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
