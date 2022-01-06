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
    const { rows } = await client.query(`
    INSERT INTO users(username, password) 
    VALUES($1, $2) 
    ON CONFLICT (username) DO NOTHING 
    RETURNING *;
  `, [username, password]);

  return rows; 
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