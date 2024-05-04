// gameservice.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const GameController = require('./GameController');

const app = express();
const port = 8004;

app.use(bodyParser.json());

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
mongoose.connect(mongoUri);

app.get('/', (req, res) => {
  res.json({
    "hi": "game service"
  });
});

// Routes
app.post('/createGame', GameController.create);
app.delete('/deleteGame/:id', GameController.delete);
app.get('/getGame/:id', GameController.getById);

const server = app.listen(port, () => {
  console.log(`Question generator Service listening at http://localhost:${port}`);
});

server.on('close', () => {
  mongoose.connection.close();
});

module.exports = server;
