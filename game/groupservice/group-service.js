const express = require('express');
const mongoose = require('mongoose');
const Group = require('./group-model');
const bodyParser = require('body-parser');

const app = express();
const port = 8004; 


app.use(bodyParser.json());

// Connect to MongoDB 
// const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
// mongoose.connect(mongoUri);

// Function to validate required fields in the request body
function validateRequiredFields(req, requiredFields) {
  for (const field of requiredFields) {
    if (!(field in req.body)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
}

/*
  PETICIONES:
  - unirse: recibe el user y se añade a members, manejar tamaño maximo de grupo y si es publico/privado contraseña
  - salir: recibe el user y se elimina de members (tambien sirve para que el admin expulse expulsar)
  - crear: recibe el user (lo asigna admin), todos los campos de grupo, y se crea el grupo
*/

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to group service module' });
});

app.post('/join', (req,requiredFields) => {
  res.json({ message: 'Joining Group' });
  //
});

app.post('/leave', (req,requiredFields) => {
  res.json({ message: 'Leaving Group' });
});

app.post('/create', (req,requiredFields) =>{
  res.json({ message: 'Creating Group' });
});

app.put('/')

const server = app.listen(port, () => {
  console.log(`Group Service listening at http://localhost:${port}`);
});

server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
  });

module.exports = server
