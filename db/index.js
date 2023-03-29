const { Pool } = require("pg");

const pathToEnvFile = `${__dirname}/../.env.test`;

require("dotenv").config({
  path: pathToEnvFile,
});

if (!process.env.PGDATABASE) {
  throw new Error("No PGDATABASE set");
}

module.exports = new Pool();
