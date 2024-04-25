// user-service.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const UserController = require('./UserController');

const app = express();
const port = 8001;

// Middleware to parse JSON in request body
app.use(bodyParser.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
mongoose.connect(mongoUri);


app.post('/adduser',UserController.addUser);
app.post('/updateLastGame', UserController.updateLastGame);
app.post('/updateStatistics', UserController.updateStatistics);
app.get('/getStatistics/:id', UserController.getStatistics);
app.get('/getUser/:username', UserController.getUserByUsername);
app.post('/getUsersByIds', UserController.getUsersByIds);
app.get('/getUserById/:id', UserController.getUserById)
app.put('/addGroup/:userUUID', UserController.addGroupToUser)
app.delete('/leaveGroup/:id', UserController.leaveGroup)

const server = app.listen(port, () => {
  console.log(`User Service listening at http://localhost:${port}`);
});

server.on('close', () => {
    mongoose.connection.close();
  });

module.exports = server