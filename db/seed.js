// inside db/seed.js

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

testDB();