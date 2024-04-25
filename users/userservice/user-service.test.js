const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('./user-model');

let mongoServer;
let app;
let mockUser;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  app = require('./user-service');
});

afterAll(async () => {
  app.close()
  await mongoServer.stop();
});


describe('User Service', () => {
  it('should add a new user on POST /adduser', async () => {
    const newUser = {
      username: 'testuser',
      password: 'testpassword',
    };

    const response = await request(app).post('/adduser').send(newUser);
    mockUser = response.body;
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
        uuid: '3c68688e-84e7-4d29-b7c7-09474d42b669',
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
  const gameUUID = '123e4567-e89b-12d3-a456-426655440001';
  const players = [
    {
      uuid: mockUser.uuid
    },
  ];

  const response = await request(app).post('/updateLastGame').send({ gameUUID, players });

  expect(response.statusCode).toBe(200);
  expect(response.body.message).toEqual('Last game updated for 1 users.');

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

});

it('returns informative error for user not found', async () => {
  const gameUUID = '123e4567-e89b-12d3-a456-426655440001'; // Valid v4 UUID
  const players = [
    {
      uuid: 'non-existent-uuid', // User not found in database
    },
  ];


  const response = await request(app).post('/updateLastGame').send({ gameUUID, players });

  expect(response.statusCode).toBe(500); // Simulate internal server error
  expect(response.body.error).toBeDefined(); // Expect an error message
});

it('retrieves user by username and returns user data without password field', async () => {
  const mockUserWithoutPassword = { ...mockUser };
  delete mockUserWithoutPassword.password;
  mockUserWithoutPassword.lastGameId = '123e4567-e89b-12d3-a456-426655440001'
  
  // Make request to the endpoint
  const response = await request(app)
    .get(`/getUser/${mockUser.username}`);

  expect(response.status).toBe(200);
  console.log(response.body)
  expect(response.body).toEqual(mockUserWithoutPassword);
});

it('gets the statistics for a player given its uuid', async () => {
  const mockUserWithoutPassword = { ...mockUser };
  delete mockUserWithoutPassword.password;
  mockUserWithoutPassword.lastGameId = '123e4567-e89b-12d3-a456-426655440001'

  const response = await request(app)
    .get(`/getStatistics/${mockUserWithoutPassword.uuid}`);

  expect(response.status).toBe(200);
  expect(response.body).toEqual(mockUserWithoutPassword);
})

});
