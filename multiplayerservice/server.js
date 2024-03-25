const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');

const app = express();
const port = 8006;

// app.use(bodyParser.json());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
mongoose.connect(mongoUri);

app.get('/', (req, res) => {
  res.json({
    "hi": "multiplayer service"
  });
});


const server = app.listen(port, () => {
  console.log(`Multiplayer Service listening at http://localhost:${port}`);
});

module.exports = server;
