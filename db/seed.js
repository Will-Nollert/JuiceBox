// used this file to bild and rebuild the tables and fill them with some startign data

// grab our client with destructuring from the export in index.js
const { 
  client,
  getAllUsuers,
 createUser
} = require('./index');


// new function, should attempt to create a few users
async function createInitialUsers() {
  try {
    console.log("Starting to create users...");

    const Albert = await createUser({ username: 'albert', password: 'bertie99' });
    const Sandra = await createUser({ username: 'Sandra', password: '2sandy4me' });
    const Glamgal = await createUser({ username: 'Glamgal', password: 'soglam' });


    console.log(Albert, Sandra, Glamgal);

    console.log("Finished creating users!");
  } catch(error) {
    console.error("Error creating users!");
    throw error;
  }
}


async function dropTables() {
  try {
    console.log("Starting to drop tables...")


    await client.query(`
    DROP TABLE IF EXISTS users;
    `);

    console.log("Finished dropping tables!")
  } catch (error) {
    console.error("Error dropping tables!")
    throw error;
    }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");


    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL
      );
    `);

    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
  } catch (error) {
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    const users = await getAllUsuers();
    console.log("getAllUsers:", users);

    console.log("Finished database tests!");
  } catch (error) {
    console.error("Error testing database!");
    throw error;
  } 
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  //why the anon function?
  .finally(() => client.end())