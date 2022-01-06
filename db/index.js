//  db/index.js 
const { Client } = require('pg'); // imports the pg module
const client = new Client('postgres://localhost:5432/juicebox-dev');



//start of user helper functions 
async function createUser({ 
  username, 
  password,
  name,
  location
}) {
  try {
    const { rows: [user] } = await client.query(`
      INSERT INTO users(username, password, name, location) 
      VALUES($1, $2, $3, $4) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `, [username, password, name, location]);

    return user;
  } catch (error) {
    throw error;
  }
}

async function getAllUsers() {
  const { rows } = await client.query(
    `SELECT id, username, location, active
    FROM users;
    `);

    return rows;
} 

async function updateUser(id, fields = {}) {
  // build the set string
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const  { rows: [ user ] } = await client.query(`
      UPDATE users
      SET ${ setString }
      WHERE id=${ id }
      RETURNING *;
    `, Object.values(fields));

    return user ;
  } catch (error) {
    throw error;
  }
}

//start of Post helper functions 

async function createPost({
  authorId,
  title,
  content
}) {
  try {
    const rows  = await client.query(`
      INSERT INTO posts(authorID, title, content) 
      VALUES($1, $2, $3, $4) 
      ON CONFLICT (title) DO NOTHING 
      RETURNING *;
    `, [authorId, title, content]);

    return rows;    

  } catch (error) {
    throw error;
  }
}

async function updatePost(id, { title, content, active })  
{
  try {
    const  { rows: [ posts ] } = await client.query(`
    UPDATE posts
    SET ${ setString }
    WHERE id=${ id }
    RETURNING *;
  `, Object.values(fields));

  return posts ;

  } catch (error) {
    throw error;
  }
}

async function getAllPosts() {
  try { 
    const { rows } = await client.query(
      `SELECT authorId, title, content 
      FROM posts;
      `);
  
      return rows;

  } catch (error) {
    throw error;
  }
}

async function getPostsByUser(userId) {
  try {
    const { rows } = client.query(`
      SELECT * FROM posts
      WHERE "authorId"=${ userId };
    `);

    return rows;
  } catch (error) {
    throw error;
  }
}


async function getUserById(userId) {
  try {
    const { rows } = client.query(`
      SELECT * FROM users
      `);

      if (rows.length === 0) {
        return null
      } else {
     console.log(rows);
      }
      
    } catch (error) {
      throw error;
    }
  // first get the user (NOTE: Remember the query returns 
    // (1) an object that contains 
    // (2) a `rows` array that (in this case) will contain 
    // (3) one object, which is our user.
  // if it doesn't exist (if there are no `rows` or `rows.length`), return null

  // if it does:
  // delete the 'password' key from the returned object
  // get their posts (use getPostsByUser)
  // then add the posts to the user object with key 'posts'
  // return the user object
}



//exports here 
module.exports = {
  client,
  createUser,
  getAllUsers,
  updateUser,
  createPost,
  updatePost,
  getAllPosts,
  getPostsByUser,
  getUserById,

  
}