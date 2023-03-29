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
      return validatePasswordFromRows({
        rows,
        password,
        resourceName: "users_task",
      });
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

exports.updateUsersTaskById = ({
  users_task_id,
  task_start_date,
  task_slug,
}) => {
  let query = "UPDATE users_plants_tasks";
  const queryParams = [users_task_id];

  if (!task_start_date && !task_slug) {
    return Promise.reject({
      msg: "include either task_slug or task_start_date",
    });
  }

  if (task_start_date) {
    query += `
    SET task_start_date = $2
    `;

    queryParams.push(task_start_date);
  }

  if (task_slug) {
    if (queryParams.length > 1) {
      query += ", ";
    } else {
      query += " SET ";
    }

    query += ` task_slug = $${queryParams.length + 1} `;

    queryParams.push(task_slug);
  }

  query += `
  WHERE users_task_id = $1
  RETURNING *
  `;

  return db.query(query, queryParams).then(({ rows }) => {
    return rows[0];
  });
};
