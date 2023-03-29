const bcrypt = require("bcrypt");

//Rows contain the hash to on rows[0]
//Also handles empty passwords and rows with length 0
//resourceName specifies what to say was not found in case rows are empty
exports.validatePasswordFromRows = ({ rows, password, resourceName }) => {
  if (!rows.length) {
    return Promise.reject({ msg: `${resourceName} not found` });
  }

  if (!password) {
    return Promise.reject({ msg: "empty password field" });
  }

  const { hash } = rows[0];

  return bcrypt.compare(password, hash).then((result) => {
    if (!result) {
      return Promise.reject({ msg: "forbidden" });
    }
  });
};
