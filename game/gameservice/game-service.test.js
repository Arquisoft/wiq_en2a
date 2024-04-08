const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

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

    // mock data
    const questions = [{ _id: 'question1_id' }, { _id: 'question2_id' }];
    const users = [{ _id: 'user1_id' }, { _id: 'user2_id' }];

    it('should create a game and update user lastGame field', async () => {
      const response = await request(app).post('/creategame').send({questions,users});
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');

      const gameId = response.body._id;
      const gameFromDB = await mongoose.model('Game').findById(gameId);
      const user1FromDB = await mongoose.model('User').findById('user1_id');
      const user2FromDB = await mongoose.model('User').findById('user2_id');

      // Assertions for the database state
      expect(gameFromDB).toBeTruthy();
      expect(user1FromDB.lastGame.toString()).toBe(gameId);
      expect(user2FromDB.lastGame.toString()).toBe(gameId);
  });
});