const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('./group-service'); // Replace 'your-app-file' with the filename where your app is defined

let mongoServer;

describe('Group Service API Tests', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.MONGODB_URI = mongoUri;
    });

  afterAll(async () => {
    app.close();
    await mongoServer.stop();
    });

  // Test case for the '/' route
  it('GET / should return welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Welcome to group service module');
  });

  // Test case for the '/join' route
  it('POST /join should return "Joining Group" message', async () => {
    const response = await request(app)
      .post('/join')
      .send({
        username: 'testUser',
        groupName: 'testGroup',
        joinCode: '123456'
      });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Joining Group');
  });

  // Test case for the '/leave' route
  it('POST /leave should return "Leaving Group" message', async () => {
    const response = await request(app)
      .post('/leave')
      .send({
        username: 'testUser',
        groupName: 'testGroup'
      });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Leaving Group');
  });

  // Test case for the '/create' route
  it('POST /create should return "Creating Group" message', async () => {
    const response = await request(app)
      .post('/create')
      .send({
        groupName: 'testGroup',
        adminUserName: 'adminUser',
        description: 'Test group',
        isPublic: true
      });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Creating Group');
  });
});