const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('./user-model');
const createMultipleUsers = require('./util/test/createMultipleUsers');

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

it('adds group to user successfully', async () => {
  const userUUID = mockUser.uuid;
  const groupUUID1 = '3c68688e-84e7-4d29-b7c7-09474d42b670';
  const groupUUID2 = '3c68688e-84e7-4d29-b7c7-09474d42b675';

  const response1 = await request(app)
    .put(`/addGroup/${userUUID}`)
    .send({ groupUUID: groupUUID1 });

  // Check if the response status is 200
  expect(response1.status).toBe(200);

  const response2 = await request(app)
  .put(`/addGroup/${userUUID}`)
  .send({ groupUUID: groupUUID2 });

  expect(response2.status).toBe(200);
  expect(response2.body).toHaveProperty("previousGroup")
  expect(response2.body.previousGroup).toEqual(groupUUID1);

  const updatedUser = await User.findOne({ uuid: mockUser.uuid });
  expect(updatedUser.groupId).toEqual(groupUUID2);
});

it('retrieves users by IDs successfully', async () => {
  const mockUsers = await createMultipleUsers(3);
  const userIds = mockUsers.map(user => user.uuid);

  const response = await request(app)
    .post(`/getUsersByIds`)
    .send({ userIds });

  expect(response.status).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);
  expect(response.body.length).toEqual(userIds.length);

  response.body.forEach((user, index) => {
    expect(user.uuid).toEqual(userIds[index]);
  });
});

it('removes user from group successfully', async () => {
  const userUUID = mockUser.uuid;
  const response = await request(app)
    .delete(`/leaveGroup/${userUUID}`);

  expect(response.status).toBe(200);

  const updatedUser = await User.findOne({ uuid: userUUID });
  expect(updatedUser.groupId).toBeNull();
});

});