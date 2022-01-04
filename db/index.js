const { Client } = require('pg'); // imports the pg module
const client = new Client('postgres://localhost:5432/juicebox-dev');



//start of helper functions 

async function getAllUsuers() {
  const { rows } = await client.query(
    `SELECT id, username 
    FROM users;
    `);

    return rows;
}

//exports here 
module.exports = {
  client,
  getAllUsuers,
}