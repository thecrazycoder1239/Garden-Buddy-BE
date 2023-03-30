const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || 'development';

const pathToEnvFile = `${__dirname}/../.env.${ENV}`;

require("dotenv").config({
  path: pathToEnvFile,
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("No PGDATABASE or DATABASE_URL set");
}

const config =  
  ENV === 'production'
    ? {
      connectionString: process.env.DATABASE_URL,
      max: 2
    } : {}


module.exports = new Pool(config);
