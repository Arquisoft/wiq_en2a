const express = require('express');
const mongoose = require('mongoose');
const GroupController = require('./GroupController');

const app = express();
const port = 8005; 

app.use(express.json());

// Connect to MongoDB 
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
mongoose.connect(mongoUri);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to group service module' });
});

app.post('/joinGroup', GroupController.joinGroup);
app.post('/leaveGroup', GroupController.leaveGroup);
app.post('/createGroup', GroupController.createGroup);

const server = app.listen(port, () => {
  console.log(`Group Service listening at http://localhost:${port}`);
});

server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
  });

module.exports = server
