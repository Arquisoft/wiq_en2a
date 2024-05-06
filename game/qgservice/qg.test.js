const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
//const QGController = require('./QGController');
const Question4Answers = require('./Question4Answers');
const { generateQuestionCapital } = require('./generatorLogic/questiongenerator')

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

    it('should return questions by their IDs', async () => {
      const questions = [
          { uuid: 'question_uuid1', question: 'Question 1', correctAnswer: 'Answer 1', incorrectAnswer1: 'Answer 2', incorrectAnswer2: 'Answer 3', incorrectAnswer3: 'Answer 4' },
          { uuid: 'question_uuid1', question: 'Question 2', correctAnswer: 'Answer 1', incorrectAnswer1: 'Answer 2', incorrectAnswer2: 'Answer 3', incorrectAnswer3: 'Answer 4' },
          { uuid: 'question_uuid1', question: 'Question 3', correctAnswer: 'Answer 1', incorrectAnswer1: 'Answer 2', incorrectAnswer2: 'Answer 3', incorrectAnswer3: 'Answer 4' },
      ];
      await Question4Answers.create(questions);

      const requestBody = {
          ids: ['question_uuid1', 'question_uuid2']
      };

      const response = await request(app).post('/getQuestionsByIds').send(requestBody);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(2);
  });

  it('should return status 500 and error message when an error occurs', async () => {
      const mockError = new Error('Internal server error');
      jest.spyOn(Question4Answers, 'find').mockRejectedValue(mockError);

      const requestBody = {
          ids: ['question_uuid1', 'question_uuid2']
      };

      const response = await request(app).post('/getQuestionsByIds').send(requestBody);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
  });

//   it('should generate a question object with correct properties', () => {
//     const countryCapitalMap = new Map([
//         ['France', 'Paris'],
//         ['Germany', 'Berlin'],
//         ['Italy', 'Rome']
//     ]);
//     const lang = 'en';
//     const question = generateQuestionCapital(countryCapitalMap, lang);
//     expect(question).toHaveProperty('uuid');
//     expect(question).toHaveProperty('question');
//     expect(question).toHaveProperty('correctAnswer');
//     expect(question).toHaveProperty('incorrectAnswer1');
//     expect(question).toHaveProperty('incorrectAnswer2');
//     expect(question).toHaveProperty('incorrectAnswer3');
// });

// it('should save the generated question to MongoDB', async () => {
//     // Mock the behavior of the save function to return a promise resolved with the question object
//     const question = {
//         uuid: 'question_uuid',
//         question: 'What is the capital of France?',
//         correctAnswer: 'Paris',
//         incorrectAnswer1: 'Berlin',
//         incorrectAnswer2: 'Rome',
//         incorrectAnswer3: 'Madrid'
//     };
//     const saveMock = jest.fn().mockResolvedValue(question);
//     jest.spyOn(Question4Answers.prototype, 'save').mockImplementation(saveMock);

//     const countryCapitalMap = new Map([
//         ['France', 'Paris']
//     ]);
//     const lang = 'en';

//     const generatedQuestion = generateQuestionCapital(countryCapitalMap, lang);

//     // Expect the save function to have been called with the question object
//     expect(saveMock).toHaveBeenCalledWith();

//     // Expect the generated question to match the returned question object from the save function
//     expect(generatedQuestion).toEqual(question);
// });
})