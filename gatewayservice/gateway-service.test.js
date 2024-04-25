const request = require('supertest');
const axios = require('axios');
const app = require('./gateway-service');
const axiosRequest = require('axios');

afterAll(async () => {
    app.close();
  });

jest.mock('axios');

const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8002';
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:8001';
const qgServiceUrl = process.env.QG_SERVICE_URL || 'http://localhost:8003';
const gameServiceUrl = process.env.GAME_SERVICE_URL || 'http://localhost:8004';

describe('Gateway Service', () => {
  // Mock responses from external services
  axios.post.mockImplementation((url, data) => {
    if (url.endsWith('/login')) {
      return Promise.resolve({ data: { token: 'mockedToken' } });
    } else if (url.endsWith('/adduser')) {
      return Promise.resolve({ data: { userId: 'mockedUserId' } });
    }
  });

  // Test /adduser endpoint
  it('should forward add user request to user service', async () => {
    const response = await request(app)
      .post('/adduser')
      .send({ username: 'newuser', password: 'newpassword' });


    expect(response.body.userId).toBe('mockedUserId');
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
  
    axios.get.mockImplementation((url) => {
      if (url.endsWith(`/game/en`)) {
        return Promise.resolve({ data: questions });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });
  
    axios.post.mockImplementation((url, data) => {
      if (url.endsWith('/createGame')) {
        return Promise.resolve({ data: game });
      } else if(url.endsWith('/updateLastGame')){
        return Promise.resolve();
      }
      return Promise.reject(new Error('Unexpected URL'));
    });
  
    const response = await request(app).post('/createGame/en').send({ players });
  
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(questions);
  
    // Assertions on axios calls
    expect(axios.get).toHaveBeenCalledWith(qgServiceUrl + '/game/en');
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