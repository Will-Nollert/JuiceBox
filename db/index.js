const { Client } = require('pg'); // imports the pg module
const client = new Client('postgres://localhost:5432/juicebox-dev');

module.exports = {
  client,
}