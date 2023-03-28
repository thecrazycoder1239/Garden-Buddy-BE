const db = require('../db/')
const bcrypt = require('bcrypt')

exports.insertUser = ({ username, first_name, last_name, password }) => {
  
  if (!username || !first_name || !last_name || ! first_name) {
    return Promise.reject({msg : "Missing required field"})
  } else if(username.length > 30) {
    return Promise.reject({msg : "username too long, maximum 30 characters"})
  } else if (first_name.length > 30) {
    return Promise.reject({msg : "first_name too long, maximum 30 characters"})
  } else if (last_name.length > 50) {
    return Promise.reject({msg : "last_name too long, maximum 50 characters"})
  }


  return bcrypt.hash(password, 10)
  .then((hash) => {
    return db.query(`
  INSERT INTO users
    (username, first_name, last_name, hash)
  VALUES
    ($1, $2, $3, $4)
  RETURNING username, first_name, last_name;
  `, [username, first_name, last_name, hash])
    .then(({rows}) => {
      return rows[0]
    })
  })

  
}