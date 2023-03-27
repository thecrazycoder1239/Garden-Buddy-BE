const db = require('../db/')

exports.insertUser = ({ username, first_name, last_name, password }) => {
  return db.query(`
  INSERT INTO users
    (username, first_name, last_name, hashed_password, hash)
  VALUES
    ($1, $2, $3, $4, $5)
  RETURNING username, first_name, last_name;
  `, [username, first_name, last_name, password, password])
    .then(({rows}) => {
      return rows[0]
    })
}