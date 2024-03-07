// user-service.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const User = require('./user-model')

const app = express();
const port = 8001;

// Middleware to parse JSON in request body
app.use(bodyParser.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
mongoose.connect(mongoUri);

function validateRequiredFields(req, requiredFields) {
    for (const field of requiredFields) {
      if (!(field in req.body)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
}

app.post('/adduser', async (req, res) => {
    try {
        validateRequiredFields(req, ['username', 'password']);

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            username: req.body.username,
            password: hashedPassword,
            lastGame: null,
        });

        await newUser.save();
        res.json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }});

  
/*
    FUNCIONES A HACER:
      1. Update User al finalizar una partida -> puntos, lastGame, preguntas acertadas/falladas
      2. Obtener ultimo juego por usuario
      3. Obtener estadisticas por usuario (puntos, partidas jugadas, preguntas acertadas/falladas)
      4. Checkear si existe usuario con username
*/

const server = app.listen(port, () => {
  console.log(`User Service listening at http://localhost:${port}`);
});

server.on('close', () => {
    mongoose.connection.close();
  });

module.exports = server