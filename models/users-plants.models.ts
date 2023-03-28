const db = require('../db/')

exports.insertTaskIntoUsersPlantsTasks = ({ users_plant_id, task_slug, task_start_date }) => {
  return db.query(`
  INSERT INTO users_plants_tasks
    (users_plant_id, task_slug, task_start_date)
  VALUES
    ($1, $2, $3)
  RETURNING *;
  `, [users_plant_id, task_slug, task_start_date])
    .then(({ rows }) => {
      return rows[0];
    })
}