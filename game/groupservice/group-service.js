const express = require('express');
const mongoose = require('mongoose');
const Group = require('./group-model')

const app = express();
const port = 8004; 


// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
mongoose.connect(mongoUri);


// TODO: hacer peticiones (get/post/put ...) para manejar logica de grupos
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to group service module' });
});


const server = app.listen(port, () => {
  console.log(`Auth Service listening at http://localhost:${port}`);
});

server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
  });

module.exports = server
