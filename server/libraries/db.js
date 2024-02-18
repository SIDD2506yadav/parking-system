const knex = require("knex");
const pg = require("pg");

pg.types.setTypeParser(20, Number);

let host = "localhost";
let user = "siddhartha";
let password = "siddhartha"
let database = "parking";

if (process.env.NODE_ENV === "production") {
  host = process.env.POSTGRES_HOST
  user = process.env.POSTGRES_USER
  database = process.env.POSTGRES_DB
  password = process.env.POSTGRES_PASSWORD
  
}

const postgres = knex({
    client: 'pg',
    connection: {
      host: host,
      user: user,
      password: password,
      database: database,
    },
});

module.exports = postgres;