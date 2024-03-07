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

/*
    FUNCIONES A HACER:
      1. Update User al finalizar una partida -> puntos, lastGame, preguntas acertadas/falladas
      2. Obtener ultimo juego por usuario
      3. Obtener estadisticas por usuario (puntos, partidas jugadas, preguntas acertadas/falladas)
      4. Checkear si existe usuario con username
*/

app.post('/adduser',UserController.addUser);
app.post('/updateLastGame', UserController.updateLastGame);
app.post('/updateStatistics', UserController.updateStatistics);

const server = app.listen(port, () => {
  console.log(`User Service listening at http://localhost:${port}`);
});

server.on('close', () => {
    mongoose.connection.close();
  });

module.exports = server