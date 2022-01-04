// used this file to bild and rebuild the tables and fill them with some startign data

// grab our client with destructuring from the export in index.js
const { 
  client,
  getAllUsuers 
} = require('./index');

async function testDB() {
  try {
    // connect the client to the database, finally
    client.connect();

    const users = await getAllUsuers();
    // for now, logging is a fine way to see what's up
    console.log(users);
  } catch (error) {
    console.error(error);
  } finally {
    // it's important to close out the client connection
    client.end();
  }
}


async function dropTables() {
try {
  await client.query(`
  DROP TABLE IF EXSISTS users;
  
  `);
} catch (error) {
  throw error;
  }
}

async function createTables() {
  try {
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL
      );
    `);
  } catch (error) {
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
  } catch (error) {
    console.error(error)
  } finally {
    client.end();
  }
}

rebuildDB();