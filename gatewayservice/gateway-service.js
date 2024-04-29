const express = require('express');
const axios = require('axios');
const cors = require('cors');
const promBundle = require('express-prom-bundle');

// libraries required for OpenAPI-Swagger
const swaggerUI = require('swagger-ui-express');
const fs = require("fs");
const YAML = require('yaml');

const app = express();
const port = 8000;

const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8002';
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:8001';
const qgServiceUrl = process.env.QG_SERVICE_URL || 'http://localhost:8003';
const gameServiceUrl = process.env.GAME_SERVICE_URL || 'http://localhost:8004';
const groupServiceUrl = process.env.GROUP_SERVICE_URL || 'http://localhost:8005'

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

app.post('/createGame/:lang', async (req, res) => {
  try {
    const lang = req.params.lang;
    const { players } = req.body;
    const url = new URL(`/game/${lang}`, qgServiceUrl);
    const createGameResponse = await axios.get(url);
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
    if(!userStats.lastGameId){
      res.json(userStats);
      return;
    }
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

// create group
app.post('/createGroup', async (req, res) => {
  try {
    const { creatorUUID } = req.body
    // create a group
    const groupResponse = await axios.post(groupServiceUrl+'/createGroup', req.body);
    // add group to user
    const url = new URL(`/addGroup/${creatorUUID}`, userServiceUrl);
    const userResponse = await axios.put(url.toString(), { groupUUID: groupResponse.data.uuid });
    // if user was in a group, leave it
    if(userResponse.data.previousGroup){
      const getGroupResponse = await axios.get(groupServiceUrl+'/getGroup/'+userResponse.data.previousGroup);
      await axios.post(groupServiceUrl+'/leaveGroup', {expelledUUID: creatorUUID, adminUUID: creatorUUID, groupName: getGroupResponse.data.groupName});
    }
    res.json(groupResponse.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})
// join group
app.post('/joinGroup', async (req, res) => {
  try{
    const { uuid } = req.body
    // join an existing group
    const groupResponse = await axios.post(groupServiceUrl+'/joinGroup', req.body);
    // add group to user
    const url = new URL(`/addGroup/${uuid}`, userServiceUrl);
    const userResponse = await axios.put(url.toString(), { groupUUID: groupResponse.data.uuid });
    // if user was in a group, leave it
    if(userResponse.data.previousGroup){
      const getGroupResponse = await axios.get(groupServiceUrl+'/getGroup/'+userResponse.data.previousGroup);
      await axios.post(groupServiceUrl+'/leaveGroup', {expelledUUID: uuid, adminUUID: uuid, groupName: getGroupResponse.data.groupName});
    }
    res.json(groupResponse.data);
  } catch(error){
    res.status(500).json({ error: error.message });
  }
})

// leave group
app.post('/leaveGroup', async (req, res) => {
  try{
    // leave an existing group
    const groupResponse = await axios.post(groupServiceUrl+'/leaveGroup', req.body);
    // remove group from user
    await axios.delete(userServiceUrl+'/leaveGroup/'+req.body.expelledUUID);
    res.json(groupResponse.data);
  } catch(error){
    res.status(500).json({ error: error.message });
  }
})

// get group by id
app.get('/getGroup/:uuid', async (req, res) => {
  try{
    const uuid = req.params.uuid
    // get group by uuid of the group
    const url = new URL(`/getGroup/${uuid}`, groupServiceUrl);
    const groupResponse = await axios.get(url.toString());
    // get admin
    const userResponseAdmin = await axios.get(userServiceUrl+'/getStatistics/'+groupResponse.data.admin);
    groupResponse.data.admin = userResponseAdmin.data
    const userIds = groupResponse.data.members
    // get members
    const userResponseMembers = await axios.post(userServiceUrl+'/getUsersByIds', {userIds});
    groupResponse.data.members = userResponseMembers.data
    res.json(groupResponse.data);
  }catch(error){
    res.status(500).json({ error: error.message });
  }
})

app.get('/getGroups', async (req, res) => {
  try{
    const groupResponse = await axios.get(groupServiceUrl+'/getGroups');
    res.json(groupResponse.data);
  }catch(error){
    res.status(500).json({ error: error.message });
  }
})

// Read the OpenAPI YAML file synchronously
openapiPath='./openapi.yaml'
if (fs.existsSync(openapiPath)) {
  const file = fs.readFileSync(openapiPath, 'utf8');

  // Parse the YAML content into a JavaScript object representing the Swagger document
  const swaggerDocument = YAML.parse(file);

  // Serve the Swagger UI documentation at the '/api-doc' endpoint
  // This middleware serves the Swagger UI files and sets up the Swagger UI page
  // It takes the parsed Swagger document as input
  app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
} else {
  console.log("Not configuring OpenAPI. Configuration file not present.")
}


// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});

module.exports = server
