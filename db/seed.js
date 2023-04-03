const db = require("./");
exports.seed = (seedDataQuery) => {
  return db
    .query(
      `
    DROP TABLE IF EXISTS subscriptions;
    DROP TABLE IF EXISTS plant_reviews;
    DROP TABLE IF EXISTS users_plants_logs;
    DROP TABLE IF EXISTS users_plants_tasks;
    DROP TABLE IF EXISTS users_plants;
    DROP TABLE IF EXISTS tasks;
    DROP TABLE IF EXISTS users;
  `
    )
    .then(() => {
      return db.query(`
      CREATE TABLE users(
        username VARCHAR(30) PRIMARY KEY,
        first_name VARCHAR(30) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        hash VARCHAR(64) NOT NULL
      );

      CREATE TABLE tasks(
        task_slug VARCHAR(25) PRIMARY KEY,
        description TEXT
      );

      CREATE TABLE users_plants(
        username VARCHAR(30) REFERENCES users(username) ON DELETE CASCADE NOT NULL,
        users_plant_id SERIAL PRIMARY KEY,
        plant_id INT NOT NULL,
        planted_date DATE
      );

      CREATE TABLE users_plants_tasks(
        users_task_id SERIAL PRIMARY KEY,
        users_plant_id INT REFERENCES users_plants(users_plant_id) ON DELETE CASCADE NOT NULL,
        task_slug VARCHAR(25) REFERENCES tasks(task_slug) ON DELETE CASCADE  NOT NULL,
        task_start_date TIMESTAMP NOT NULL,
        notified BOOLEAN DEFAULT 'false'
      );

      CREATE TABLE users_plants_logs(
        log_id SERIAL PRIMARY KEY,
        users_plant_id INT REFERENCES users_plants(users_plant_id) ON DELETE CASCADE NOT NULL,
        log_date DATE NOT NULL DEFAULT CURRENT_DATE,
        body TEXT NOT NULL
      );

      CREATE TABLE plant_reviews(
        review_id SERIAL PRIMARY KEY,
        author_username VARCHAR(30) REFERENCES users(username) ON DELETE CASCADE  NOT NULL,
        plant_id INT NOT NULL,
        stars INT NOT NULL,
        body TEXT
      );
      
      CREATE TABLE subscriptions(
        username VARCHAR(30) REFERENCES users(username) ON DELETE CASCADE  NOT NULL,
        push_subscription JSON,
        push_endpoint TEXT PRIMARY KEY
      );
    `);
    })
    .then(() => {
      if (seedDataQuery) {
        return db.query(seedDataQuery);
      }
    });
};
