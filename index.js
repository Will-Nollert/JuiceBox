require('dotenv').config();

const PORT = 3000;
const express = require('express');
const server = express();
const morgan = require('morgan');
server.use(morgan('dev'));

server.use(express.json())



const router = require('./api');
server.use('/api', router);



//First (body logging) middlewaer 
server.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");
  
    next();
  });


  //connect the client 
  const { client } = require('./db');
client.connect();

  server.listen(PORT, () => {
    console.log('The server is up on port', PORT)
  });
  