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
    } else if (url.endsWith('/createGame')) {
      return Promise.resolve({ data: { questions: [] } });
    }
  });

  // Test /login endpoint
  it('should forward login request to auth service', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBe('mockedToken');
  });

  // Test /adduser endpoint
  it('should forward add user request to user service', async () => {
    const response = await request(app)
      .post('/adduser')
      .send({ username: 'newuser', password: 'newpassword' });

    // expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe('mockedUserId');
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
  /*it('should return questions on successful request to /createGame', async () => {
    const testData = {
      "players": [
        { "uuid": "3c68688e-84e7-4d29-b7c7-09474d42b669" }
      ]
    };
  
    const response = await request(app)
      .post('/createGame')
      .send(testData);
  
    // Verify status code
    expect(response.statusCode).toBe(200);
  
    // Verify response body
    expect(response.body).toEqual({ questions: [] });
  });

  it('should handle internal server error from /game endpoint', async () => {
    // Mock the axios.get method to simulate an error response from /game endpoint
    axios.get.mockRejectedValue({ response: { status: 500, data: { error: 'Internal server error' } } });

    const response = await request(app).get('/questionsGame');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal server error' });
  });
  */

});