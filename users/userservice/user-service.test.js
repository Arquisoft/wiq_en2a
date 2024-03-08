const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('./user-model');

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  mockUser = new User({
    uuid: '3c68688e-84e7-4d29-b7c7-09474d42b669', // Valid v4 UUID
    username: 'XXXXXXXX',
    password: 'XXXXXXXX',
    createdAt: '2022-01-01T00:00:00.000Z',
    nCorrectAnswers: 10,
    nWrongAnswers: 5,
    totalScore: 15,
    nWins: 2,
  });
  jest.spyOn(User, 'findOne').mockResolvedValue(mockUser)
  app = require('./user-service'); 
});

afterEach(async () => {
  jest.clearAllMocks();
})

afterAll(async () => {
    app.close();
    await mongoServer.stop();
});

describe('User Service', () => {
  it('should add a new user on POST /adduser', async () => {
    const newUser = {
      username: 'testuser',
      password: 'testpassword',
    };

    const response = await request(app).post('/adduser').send(newUser);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuser');
  });

  it('updates statistics for valid players', async () => {
    const players = [
      {
        uuid: '3c68688e-84e7-4d29-b7c7-09474d42b669', // Valid v4 UUID
        nCorrectAnswers: 2,
        nWrongAnswers: 1,
        totalScore: 3,
        isWinner: true,
      },
      {
        uuid: '3c68688e-84e7-4d29-b7c7-09474d42b669', // Valid UUID with extra spaces (trimmed)
        nCorrectAnswers: 5,
        nWrongAnswers: 3,
        totalScore: 8,
        isWinner: false,
      },
    ];

    const response = await request(app).post('/updateStatistics').send({ players });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual('Statistics updated for 2 users.');
  })

  it('returns error for invalid data in request body', async () => {
    const players = [
      {
        uuid: '3c68688e-84e7-4d29-b7c7-09474d42b669',
        nWrongAnswers: 1,
        totalScore: 3,
        isWinner: true,
      },
    ];
  
    const response = await request(app).post('/updateStatistics').send({ players });
  
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBeDefined();
  })
  it('returns error for player with invalid UUID', async () => {
    const players = [
      { // Invalid UUID format
        uuid: 'invalid-uuid',
        nCorrectAnswers: 2,
        nWrongAnswers: 1,
        totalScore: 3,
        isWinner: true,
      },
    ];
  
    const response = await request(app).post('/updateStatistics').send({ players });
  
    expect(response.statusCode).toBe(400); // Simulate a bad request error code
    expect(response.body.error).toEqual('Invalid UUID'); // Expect specific error message
  })

});
