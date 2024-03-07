// qg-service.js
const express = require('express');
const mongoose = require('mongoose');
const QGController = require('./QGController');

const app = express();
const port = 8003;

app.use(express.json());

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
mongoose.connect(mongoUri);


app.get('/', (req, res) => {
  res.json({
    "hi": "question generator"
  });
});

app.get('/game', QGController.getQuestions);


const server = app.listen(port, () => {
  console.log(`Question generator Service listening at http://localhost:${port}`);
});

module.exports = server;
