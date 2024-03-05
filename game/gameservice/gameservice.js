// gameservice.js
const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');

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
/* 

  PETICIONES A HACER:
    1. Crear game dado un array de preguntas y un array de usuarios.

 */

const server = app.listen(port, () => {
  console.log(`Question generator Service listening at http://localhost:${port}`);
});

module.exports = server;
