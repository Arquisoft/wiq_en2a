const request = require('supertest');
const axios = require('axios');
const app = require('./gateway-service');
const axiosRequest = require('axios');
const testGroupMembershipChange = require('./util/testGroupMembershipChange');

afterAll(async () => {
    app.close();
  });
beforeEach(() => {
  axios.get.mockReset();
  axios.post.mockReset();
})

jest.mock('axios');

const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8002';
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:8001';
const qgServiceUrl = process.env.QG_SERVICE_URL || 'http://localhost:8003';
const gameServiceUrl = process.env.GAME_SERVICE_URL || 'http://localhost:8004';

describe('Gateway Service', () => {

  // Test /adduser endpoint
  it('should add a user successfully', async () => {
    // Mock axios response for successful user creation
    const userData = { username: 'testuser' };
    axios.post.mockResolvedValueOnce({ data: userData });

    // Make request to the endpoint
    const response = await request(app)
      .post('/adduser')
      .send({ username: 'testuser', password: 'testpassword' });

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toEqual(userData);

    // Ensure axios call was made with the correct parameters
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/adduser'),
      { username: 'testuser', password: 'testpassword' }
    );
  });

  it('should forward login request to auth service', async () => {

    const loginPayload = { username: 'testuser', password: 'testpassword' }
    const authResponse = {data: {username: 'testuser'}}
    const userResponse = {data: {
      uuid: 'user-uuid',
      username: 'testuser',
      nCorrectAnswers: 30,
      nWrongAnswers: 20,
      lastGameId: 'game-uuid',
      totalScore: 2500
    }}

    axios.post.mockResolvedValueOnce(authResponse);
    
    axios.get.mockResolvedValueOnce(userResponse);

    const response = await request(app)
      .post('/login')
      .send(loginPayload);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(userResponse.data);

    expect(axios.post).toHaveBeenCalledWith(authServiceUrl + '/login', loginPayload);

    expect(axios.get).toHaveBeenCalledWith(userServiceUrl + '/getUser/' + authResponse.data.username);
  });

  it('fetches user stats successfuly', async () => {

    const mockUserStats = {
      id: 1,
      username: 'testuser',
      lastGameId: 2,
    };

    const mockGameResponse = {
      data: [
        {
          questions: [1, 2, 3],
        },
      ],
    };

    const mockQuestionsData = [
      { id: 1, question: 'Question 1' },
      { id: 2, question: 'Question 2' },
      { id: 3, question: 'Question 3' },
    ];
    axios.get.mockImplementation((url) => {
      if (url.endsWith(`/getStatistics/1`)) {
        return Promise.resolve({ data: mockUserStats });
      } else if (url.endsWith('/getGame/2')) {
        return Promise.resolve(mockGameResponse);
      }
      return Promise.reject(new Error('Unexpected URL'));
    });
  
    axios.post.mockImplementation((url, data) => {
      if (url.endsWith('/getQuestionsByIds')) {
        expect(data).toEqual({ ids: [1, 2, 3] });
        return Promise.resolve({ data: mockQuestionsData });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });

    const response = await request(app).get('/getStats/1');
  
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      userStats: mockUserStats,
      lastGame: mockQuestionsData,
    });
  })

  it('creates a game and updates last game for players', async () => {
    const players = [
      { uuid: 'user1-uuid' },
      { uuid: 'user2-uuid' },
    ];
    const questions = [
      { question: 'Sample Question 1' },
      { question: 'Sample Question 2' }
    ];
    const game = { uuid: 'game-uuid-123' };

    axios.get.mockResolvedValueOnce({data: questions})
    axios.post.mockResolvedValueOnce({data: game})
  
    const response = await request(app).post('/createGame/en').send({ players });
  
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(questions);
  
    // Assertions on axios calls
    expect(axios.post).toHaveBeenCalledWith(gameServiceUrl + '/createGame', { players, questions });
    expect(axios.post).toHaveBeenCalledWith(userServiceUrl + '/updateLastGame', { gameUUID: game.uuid, players });
  
  });

  it('updates statistics for players and returns response from statistics service', async () => {
    const players = [
      { 
        uuid: 'player2-uuid',
        nCorrectAnswers: 12,
        nWrongAnswers: 2,
        totalScore: 800,
        isWinner: true
       },
    ];

    const statisticsResponse = { /* Mocked statistics response */ };

    axios.post.mockResolvedValueOnce({ data: statisticsResponse });

    const response = await request(app)
      .post('/updateStats')
      .send({ players });

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toEqual(statisticsResponse);

    // Ensure axios post is called with the correct data
    expect(axios.post).toHaveBeenCalledWith(userServiceUrl + '/updateStatistics', { players });
  });
  

});

describe('POST /createGroup', () => {
  it('should create a group and add the user to it', async () => {
    axios.post.mockResolvedValueOnce({ data: { uuid: 'group-uuid' } });
    axios.put.mockResolvedValueOnce({ data: { previousGroup: null } });

    const response = await request(app)
      .post('/createGroup')
      .send({ creatorUUID: 'user-uuid' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ uuid: 'group-uuid' });

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/createGroup'),
      { creatorUUID: 'user-uuid' }
    );
    expect(axios.put).toHaveBeenCalledWith(
      expect.stringContaining('/addGroup/user-uuid'),
      { groupUUID: 'group-uuid' }
    );
  });

  it('when creating a group, remove user from previous group if they where in one', async () => {
    await testGroupMembershipChange(app,'/createGroup', { creatorUUID: 'user-uuid', uuid: 'user-uuid' }, 'Prev Group');
  })

  it('should handle errors', async () => {
    axios.post.mockRejectedValueOnce(new Error('Internal server error'));

    const response = await request(app)
      .post('/createGroup')
      .send({ creatorUUID: 'user-uuid' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal server error' });
  });
})

describe('POST /joinGroup', () => {
  it('should join a group and add the user to it', async () => {
    axios.post.mockResolvedValueOnce({ data: { uuid: 'group-uuid' } });
    axios.put.mockResolvedValueOnce({ data: { previousGroup: null } });

    const response = await request(app)
      .post('/joinGroup')
      .send({ uuid: 'user-uuid', groupName: 'Test Group', joinCode: '123456' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ uuid: 'group-uuid' });

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/joinGroup'),
      { uuid: 'user-uuid', groupName: 'Test Group', joinCode: '123456' }
    );
    expect(axios.put).toHaveBeenCalledWith(
      expect.stringContaining('/addGroup/user-uuid'),
      { groupUUID: 'group-uuid' }
    );
  });

  it('when joining a group, remove user from previous group if they where in one', async () => {
    await testGroupMembershipChange(app,'/joinGroup', { uuid: 'user-uuid', groupName: 'Test Group', joinCode: '123456' }, 'Previous Group');
  })

  it('should handle errors', async () => {
    axios.post.mockRejectedValueOnce(new Error('Internal server error'));

    const response = await request(app)
      .post('/joinGroup')
      .send({ uuid: 'user-uuid', groupName: 'Test Group', joinCode: '123456' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal server error' });
  });
});

describe('POST /leaveGroup', () => {
  it('should leave a group and remove the user from it', async () => {
    // Mock axios responses
    axios.post.mockResolvedValueOnce({ data: { message: 'Left group successfully' } });
    axios.delete.mockResolvedValueOnce();

    // Make request to the endpoint
    const response = await request(app)
      .post('/leaveGroup')
      .send({ expelledUUID: 'user-uuid', adminUUID: 'admin-uuid', groupName: 'Test Group' });

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Left group successfully' });

    // Ensure axios calls were made with the correct parameters
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/leaveGroup'),
      { expelledUUID: 'user-uuid', adminUUID: 'admin-uuid', groupName: 'Test Group' }
    );
    expect(axios.delete).toHaveBeenCalledWith(
      expect.stringContaining('/leaveGroup/user-uuid')
    );
  });

  it('should handle errors', async () => {
    // Mock axios responses to simulate an error
    axios.post.mockRejectedValueOnce(new Error('Internal server error'));

    // Make request to the endpoint
    const response = await request(app)
      .post('/leaveGroup')
      .send({ expelledUUID: 'user-uuid', adminUUID: 'admin-uuid', groupName: 'Test Group' });

    // Assertions
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal server error' });
  });
});

describe('GET /getGroup/:uuid', () => {
  it('should return group information with admin and members', async () => {
    // Mock axios responses
    const groupResponseData = {
      uuid: 'group-uuid',
      admin: 'admin-uuid',
      members: ['member-uuid-1', 'member-uuid-2']
    };
    const adminResponseData = {
      username: 'admin-username'
    };
    const membersResponseData = [
      { username: 'member-1-username' },
      { username: 'member-2-username' }
    ];

    axios.get.mockResolvedValueOnce({ data: groupResponseData });
    axios.get.mockResolvedValueOnce({ data: adminResponseData });
    axios.post.mockResolvedValueOnce({ data: membersResponseData });

    // Make request to the endpoint
    const response = await request(app)
      .get('/getGroup/group-uuid');

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      uuid: 'group-uuid',
      admin: adminResponseData,
      members: membersResponseData
    });

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/getGroup/group-uuid')
    );
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/getStatistics/admin-uuid')
    );
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/getUsersByIds'),
      { userIds: ['member-uuid-1', 'member-uuid-2'] }
    );
  });

  it('should handle errors', async () => {
    // Mock axios responses to simulate an error
    axios.get.mockRejectedValueOnce(new Error('Internal server error'));

    // Make request to the endpoint
    const response = await request(app)
      .get('/getGroup/group-uuid');

    // Assertions
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal server error' });
  });
});

describe('GET /getGroups', () => {
  beforeEach(() => {
    axios.get.mockReset();
  });

  it('should retrieve groups successfully', async () => {
    const groupsData = [{ name: 'group1' }, { name: 'group2' }];
    axios.get.mockResolvedValueOnce({ data: groupsData });

    const response = await request(app).get('/getGroups');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(groupsData);

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/getGroups'));
  });

  it('should handle errors properly', async () => {
    const error = new Error('Group service error');
    error.response = { status: 500, data: { error: 'Internal server error' } };
    axios.get.mockRejectedValueOnce(error);

    const response = await request(app).get('/getGroups');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Group service error' });

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/getGroups'));
  });
});
