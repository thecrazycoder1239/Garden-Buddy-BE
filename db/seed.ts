const db = require('./')

exports.seed = (seedDataQuery) => {
  return db.query(`
  DROP TABLE IF EXISTS subscriptions;
  DROP TABLE IF EXISTS plant_reviews;
  DROP TABLE IF EXISTS user_tasks;
  DROP TABLE IF EXISTS tasks;
  DROP TABLE IF EXISTS users;
  `)
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
  
  CREATE TABLE user_tasks(
     username VARCHAR(30) REFERENCES users(username) NOT NULL,
     plant_id INT NOT NULL,
     planted_date DATE,
     task_slug VARCHAR(25) REFERENCES tasks(task_slug) NOT NULL,
     task_start_date DATE NOT NULL
  );
  
  CREATE TABLE plant_reviews(
      review_id SERIAL PRIMARY KEY,
      author_username VARCHAR(30) REFERENCES users(username) NOT NULL,
      plant_id INT NOT NULL,
      stars INT NOT NULL,
      body TEXT
  );
  
  CREATE TABLE subscriptions(
       username VARCHAR(30) REFERENCES users(username) NOT NULL,
       push_subscription JSON,
       push_endpoint TEXT
  );
    `)
  })
  .then(() => {
    if (seedDataQuery) {
      db.query(seedDataQuery)
    }
  })
}