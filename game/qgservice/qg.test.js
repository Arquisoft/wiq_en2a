const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const QGController = require('./QGController');

let app;
let mongoServer;

describe('Group Service API Tests', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.MONGODB_URI = mongoUri;
    app = require('./qg-service'); 
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    app.close();
    await mongoServer.stop();
    });

    it('GET / should return welcome message', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Welcome to question generator service module');
    });
})