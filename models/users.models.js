const db = require("../db/");
const bcrypt = require("bcrypt");
const { validatePasswordFromRows } = require("../utils/cypto");

//validateUserPassword handles 404 for non-existent users and 400 for empty password field
exports.validateUserPassword = ({ username, password }) => {
  return db
    .query(
      `
  SELECT hash FROM users
  WHERE username = $1
  `,
      [username]
    )
    .then(({ rows }) => {
      return validatePasswordFromRows({ rows, password, resourceName: "user" });
    });
};

exports.insertUser = ({ username, first_name, last_name, password }) => {
  if (!username || !first_name || !last_name || !first_name) {
    return Promise.reject({ msg: "Missing required field" });
  } else if (username.length > 30) {
    return Promise.reject({ msg: "username too long, maximum 30 characters" });
  } else if (first_name.length > 30) {
    return Promise.reject({
      msg: "first_name too long, maximum 30 characters",
    });
  } else if (last_name.length > 50) {
    return Promise.reject({ msg: "last_name too long, maximum 50 characters" });
  }
  return bcrypt.hash(password, 10).then((hash) => {
    return db
      .query(
        `
  INSERT INTO users
    (username, first_name, last_name, hash)
  VALUES
    ($1, $2, $3, $4)
  RETURNING username, first_name, last_name;
  `,
        [username, first_name, last_name, hash]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  });
};

exports.selectUserByUsername = (username) => {
  return db
    .query(
      `
  SELECT username, first_name, last_name FROM users
  WHERE username = $1
  `,
      [username]
    )
    .then(({ rows }) => {
      if (rows.length) {
        return rows[0];
      } else {
        return Promise.reject({ msg: "user not found" });
      }
    });
};

exports.removeUserByUsername = (username) => {
  return db.query(
    `
  DELETE FROM users
  WHERE username = $1
  `,
    [username]
  );
};

exports.insertPlantToUser = ({ username, plant_id, planted_date }) => {
  return db
    .query(
      `
  INSERT INTO users_plants
  (username, plant_id, planted_date)
  VALUES 
  ($1, $2, $3)
  RETURNING *
  `,
      [username, plant_id, planted_date]
    )
    .then(({ rows }) => {
      return Object.assign(Object.assign({}, rows[0]), { tasks: [] });
    });
};

exports.selectUsersPlantsByUsername = (username) => {
  return db
    .query(
      `
  SELECT * FROM users_plants
  WHERE username = $1
  `,
      [username]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.updateUserFirstName = (username, first_name) => {
  return db
    .query(
      `UPDATE users
  SET
    first_name = $1
  WHERE 
      username = $2
  RETURNING *;`,
      [first_name, username]
    )
    .then((response) => {
      return response.rows[0];
    });
};


exports.updateUserLastName = (username, last_name) => {
  return db
    .query(
      `UPDATE users
  SET
    last_name = $1
  WHERE 
      username = $2
  RETURNING *;`,
      [last_name, username]
    )
    .then((response) => {
      return response.rows[0];
    });
};
