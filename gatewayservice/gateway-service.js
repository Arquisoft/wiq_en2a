const express = require('express');
const axios = require('axios');
const cors = require('cors');
const promBundle = require('express-prom-bundle');

const app = express();
const port = 8000;

const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8002';
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:8001';
const qgServiceUrl = process.env.QG_SERVICE_URL || 'http://localhost:8003';
const gameServiceUrl = process.env.GAME_SERVICE_URL || 'http://localhost:8004';

app.use(cors());
app.use(express.json());

//Prometheus configuration
const metricsMiddleware = promBundle({includeMethod: true});
app.use(metricsMiddleware);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'OK' });
});

app.post('/login', async (req, res) => {
  try {
    // Forward the login request to the authentication service
    const authResponse = await axios.post(authServiceUrl+'/login', req.body);
    const username = authResponse.data.username;
    const userResponse = await axios.get(userServiceUrl+'/getUser/' + username);
    res.json(userResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post('/adduser', async (req, res) => {
  try {
    // Forward the add user request to the user service
    const userResponse = await axios.post(userServiceUrl+'/adduser', req.body);
    res.json(userResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post('/updateStats', async (req, res) => {
  try {
    const { players } = req.body;
    const response = await axios.post( userServiceUrl+"/updateStatistics", {players});
    
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/createGame', async (req, res) => {
  try {
    const { players } = req.body;
    const createGameResponse = await axios.get(qgServiceUrl+'/game');
    const questions = createGameResponse.data;
    const gameResponse = await axios.post(gameServiceUrl+'/createGame', {players, questions});
    const game = gameResponse.data;
    const gameUUID = game.uuid;
    await axios.post(userServiceUrl+'/updateLastGame', {gameUUID, players});
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/getStats/:id', async (req, res) => {
  try {
    const baseUrl = userServiceUrl + '/getStatistics/';
    const uuid = req.params.id;
    const encodedUuid = encodeURIComponent(uuid);
    
    const statsResponse = await axios.get(`${baseUrl}${encodedUuid}`);
    const userStats = statsResponse.data;
    const gameResponse = await axios.get(gameServiceUrl+'/getGame/'+userStats.lastGameId);
    const ids = gameResponse.data[0].questions;
    const questionsResponse = await axios.post(qgServiceUrl+'/getQuestionsByIds', {ids});
    const questionsData = questionsResponse.data;
    const combinedResponse = {
      userStats,
      lastGame: questionsData
    }
    res.json(combinedResponse);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
})


// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});

module.exports = server
