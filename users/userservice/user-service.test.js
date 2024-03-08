const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('./user-model');
const isValidUuidV4 = require('./util/ValidateUUID')

let mongoServer;
let app;
let mockUser;

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

it('updates last game for valid players', async () => {
  const gameUUID = '123e4567-e89b-12d3-a456-426655440001'; // Valid v4 UUID
  const players = [
    {
      uuid: '3c68688e-84e7-4d29-b7c7-09474d42b669', // Valid v4 UUID
    },
    {
      uuid: '3c68688e-84e7-4d29-b7c7-09474d42b669', // Valid UUID with extra spaces (trimmed)
    },
  ];

  mockUser.lastGameId = undefined; // Reset lastGameId for testing

  const response = await request(app).post('/updateLastGame').send({ gameUUID, players });

  expect(response.statusCode).toBe(200);
  expect(response.body.message).toEqual('Last game updated for 2 users.');

  // Assertions on User model interactions (mock calls)

  expect(User.findOne).toHaveBeenCalledTimes(2); // User.findOne called twice (once per player)
  expect(mockUser.lastGameId).toEqual(gameUUID); // Updated lastGameId on mock user
});

it('returns error for invalid UUID in request', async () => {
  const gameUUID = '123e4567-e89b-12d3-a456-426655440001'; // Valid v4 UUID
  const players = [
    {
      uuid: 'invalid-uuid', // Invalid format
    },
  ];

  const response = await request(app).post('/updateLastGame').send({ gameUUID, players });

  expect(response.statusCode).toBe(500); // Simulate internal server error
  expect(response.body.error).toEqual('Invalid UUID provided');

  // Assertions on validation and User model interactions
  expect(User.findOne).not.toHaveBeenCalled(); // User.findOne not called due to validation failure
});

it('returns informative error for user not found', async () => {
  const gameUUID = '123e4567-e89b-12d3-a456-426655440001'; // Valid v4 UUID
  const players = [
    {
      uuid: 'non-existent-uuid', // User not found in database
    },
  ];

  jest.spyOn(User, 'findOne').mockResolvedValue(null); // Simulate user not found

  const response = await request(app).post('/updateLastGame').send({ gameUUID, players });

  expect(response.statusCode).toBe(500); // Simulate internal server error
  expect(response.body.error).toBeDefined(); // Expect an error message
});

});
