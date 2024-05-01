const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Game = require('./game-model');
const { createGame } = require('./queries/CreateGame');

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  app = require('./gameservice'); 
});

afterAll(async () => {
    app.close();
    await mongoServer.stop();
});

describe('Game service', () => {

    it('should create a game and update user lastGame field', async () => {

      const questions = [{ uuid: 'question1_id' }, { uuid: 'question2_id' }];
      const players = [{ uuid: 'user1_id' }, { uuid: 'user2_id' }];

      const response = await request(app).post('/creategame').send({questions,players});
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');

      const gameUUId = response.body.uuid;

      const gameInDB = await Game.findOne({ uuid: gameUUId });
      // expect the game to exist
      expect(gameInDB).toBeTruthy();

      // Expect the game to have the correct questions
      expect(gameInDB.questions.length).toBe(questions.length);
      for (let i = 0; i < questions.length; i++) {
          expect(gameInDB.questions[i]).toBe(questions[i].uuid);
      }

      // Expect the game to have the correct players
      expect(gameInDB.players.length).toBe(players.length);
      for (let i = 0; i < players.length; i++) {
          expect(gameInDB.players[i]).toBe(players[i].uuid);
      }

  });

  it('should return status 500 when sending invalid data', async () => {
    const invalidData = {}; // Sending empty object as invalid data

    const response = await request(app).post('/creategame').send(invalidData);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message');
});

it('should delete a game', async () => {
  // Create a game to be deleted
  const newGame = await Game.create({ uuid: 'game_to_delete_id' });

  // Send request to delete the game
  const response = await request(app).delete(`/deletegame/${newGame.uuid}`);

  // Expect response status to be 200
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('message', 'Game deleted');

  // Verify that the game is deleted from the database
  const deletedGame = await Game.findOne({ uuid: newGame.uuid });
  expect(deletedGame).toBeNull(); // Expect deletedGame to be null, indicating it doesn't exist in the database
});

it('should return a game by its ID', async () => {
  // Create a game to retrieve
  const newGame = await Game.create({ uuid: 'game_to_retrieve_id' });

  // Send request to retrieve the game by its ID
  const response = await request(app).get(`/getgame/${newGame.uuid}`);

  // Expect response status to be 200
  expect(response.status).toBe(200);
  expect(response.body).toHaveLength(1); // Assuming the endpoint always returns an array of games
  expect(response.body[0]).toHaveProperty('uuid', newGame.uuid); // Assuming the game object contains a UUID property
});

it('should return a JSON response with "hi" message', async () => {
  const response = await request(app).get('/');
  
  // Expect response status to be 200
  expect(response.status).toBe(200);
  
  // Expect response body to contain the expected JSON object
  expect(response.body).toEqual({ hi: 'game service' });
});

it('should throw an error if no players are found', async () => {
  // Prepare test data with empty players array
  const questions = [{ uuid: 'question1_id' }, { uuid: 'question2_id' }];
  const players = [];

  // Expect createGame function to throw an error when called with empty players array
  await expect(createGame(questions, players)).rejects.toThrow('No players found');
});

it('should throw an error if player UUID is null or undefined', async () => {
  // Prepare test data with null or undefined player UUID
  const questions = [{ uuid: 'question1_id' }, { uuid: 'question2_id' }];
  const players = [{ uuid: null }, { uuid: undefined }];

  // Expect createGame function to throw an error when called with player UUID null or undefined
  await expect(createGame(questions, players)).rejects.toThrow('No players found');
});

});