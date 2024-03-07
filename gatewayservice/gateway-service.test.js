const request = require('supertest');
const axios = require('axios');
const app = require('./gateway-service');
const axiosRequest = require('axios');

afterAll(async () => {
    app.close();
  });

jest.mock('axios');

describe('Gateway Service', () => {
  // Mock responses from external services
  axios.post.mockImplementation((url, data) => {
    if (url.endsWith('/login')) {
      return Promise.resolve({ data: { token: 'mockedToken' } });
    } else if (url.endsWith('/adduser')) {
      return Promise.resolve({ data: { userId: 'mockedUserId' } });
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

    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe('mockedUserId');
  });

  it('should return questions on successful request to /game', async () => {
    // Mock the axios.get method to simulate a successful response from /game endpoint
    axios.get.mockResolvedValue({
      data: [
        { question: 'Sample Question 1',
          correctAnswer: 'Sample Answer 1',
          incorrectAnswer1: 'Sample Answer 2',
          incorrectAnswer2: 'Sample Answer 3',
          incorrectAnswer3: 'Sample Answer 4',
        } 
      ],
    });

    const response = await request(app).get('/questionsGame');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { question: 'Sample Question 1',
          correctAnswer: 'Sample Answer 1',
          incorrectAnswer1: 'Sample Answer 2',
          incorrectAnswer2: 'Sample Answer 3',
          incorrectAnswer3: 'Sample Answer 4',
      },
    ]);
  });

  it('should handle internal server error from /game endpoint', async () => {
    // Mock the axios.get method to simulate an error response from /game endpoint
    axios.get.mockRejectedValue({ response: { status: 500, data: { error: 'Internal server error' } } });

    const response = await request(app).get('/questionsGame');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal server error' });
  });
});