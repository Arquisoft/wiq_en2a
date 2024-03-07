// gameservice.js
const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const { createGame } = require('./queries/CreateGame');
const GameController = require('./GameController');

const app = express();
const port = 8004;

// app.use(bodyParser.json());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
mongoose.connect(mongoUri);

app.get('/', (req, res) => {
  res.json({
    "hi": "game service"
  });
});

// Routes
app.post('/creategame', GameController.create);
app.delete('/deletegame/:id', GameController.delete);
app.get('/getById/:id', GameController.getById);

const server = app.listen(port, () => {
  console.log(`Question generator Service listening at http://localhost:${port}`);
});

module.exports = server;
