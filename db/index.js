//  db/index.js 
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

async function createUser ({ username, password }) {
  try {
    const result = await client.query(`
    INSERT INTO users(username, password)
    VALUES ($1, $2);
  `, [username, password]);

  return result
} catch (error) {
  throw error;
  }
}


//exports here 
module.exports = {
  client,
  createUser,
  getAllUsuers,
}