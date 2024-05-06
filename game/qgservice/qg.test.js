const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
//const QGController = require('./QGController');
const Question4Answers = require('./Question4Answers');
const { generateQuestionCapital } = require('./generatorLogic/questiongenerator')
const { executeSparqlQuery } = require('./generatorLogic/SparqlQuery')
const { bindCapitalsResults } = require('./generatorLogic/BindResults')
const { createMathQuestions, generateRandomMathQuestion } = require('./generatorLogic/MathQuestions')
const axios = require('axios');

let app;
let mongoServer;

describe('Question generator Service API Tests', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.MONGODB_URI = mongoUri;
    app = require('./qg-service'); 
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    await Question4Answers.deleteMany({});
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

      const findMock = jest.spyOn(Question4Answers, 'find');
  
      // Mock the return values for the find method
      findMock.mockReturnValueOnce(
        Promise.resolve([
          { uuid: 'question_uuid1', question: 'Question 1', correctAnswer: 'Answer 1', incorrectAnswer1: 'Answer 2', incorrectAnswer2: 'Answer 3', incorrectAnswer3: 'Answer 4' },
        ])
      );
      findMock.mockReturnValueOnce(
        Promise.resolve([
          { uuid: 'question_uuid2', question: 'Question 2', correctAnswer: 'Answer 1', incorrectAnswer1: 'Answer 2', incorrectAnswer2: 'Answer 3', incorrectAnswer3: 'Answer 4' },
        ])
      );

      const requestBody = {
          ids: ['question_uuid1', 'question_uuid2']
      };

      const response = await request(app).post('/getQuestionsByIds').send(requestBody);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(2);
      
      // Assert properties of the first question
      expect(response.body[0]).toHaveLength(1); // Nested array with one question
      expect(response.body[0][0]).toEqual({
        uuid: 'question_uuid1',
        question: 'Question 1',
        correctAnswer: 'Answer 1',
        incorrectAnswer1: 'Answer 2',
        incorrectAnswer2: 'Answer 3',
        incorrectAnswer3: 'Answer 4'
      });

      // Assert properties of the second question
      expect(response.body[1]).toHaveLength(1); // Nested array with one question
      expect(response.body[1][0]).toEqual({
        uuid: 'question_uuid2',
        question: 'Question 2',
        correctAnswer: 'Answer 1',
        incorrectAnswer1: 'Answer 2',
        incorrectAnswer2: 'Answer 3',
        incorrectAnswer3: 'Answer 4'
      });
      
      // Restore the original implementation of the find method
      findMock.mockRestore();
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

  it('should execute SPARQL query and return response data', async () => {
    const responseData = { results: { bindings: [{ label: { value: 'Example Label' } }] } };
    const axiosGetMock = jest.spyOn(axios, 'get').mockResolvedValue({ data: responseData });

    const query = 'SELECT ?label WHERE { wd:Q42 rdfs:label ?label }';
    const response = await executeSparqlQuery(query);

    expect(axiosGetMock).toHaveBeenCalledWith('https://query.wikidata.org/sparql', {
        headers: {
            'User-Agent': 'Your User Agent',
            'Accept': 'application/json',
        },
        params: {
            query: query,
            format: 'json',
        },
    });

    expect(response).toEqual(responseData);
});

it('should throw an error when an error occurs during execution', async () => {
    const errorMessage = 'Network Error';
    const axiosGetMock = jest.spyOn(axios, 'get').mockRejectedValue(new Error(errorMessage));

    const query = 'SELECT ?label WHERE { wd:Q42 rdfs:label ?label }';

    await expect(executeSparqlQuery(query)).rejects.toThrow(errorMessage);

    expect(axiosGetMock).toHaveBeenCalledWith('https://query.wikidata.org/sparql', {
        headers: {
            'User-Agent': 'Your User Agent',
            'Accept': 'application/json',
        },
        params: {
            query: query,
            format: 'json',
        },
    });
});

it('should bind query results to a Map of capitals', () => {
  // Mock query result
  const queryResult = {
    results: {
      bindings: [
        { countryLabel: { value: 'France' }, capitalLabel: { value: 'Paris' } },
        { countryLabel: { value: 'Germany' }, capitalLabel: { value: 'Berlin' } }
      ]
    }
  };

  // Call the function with the mocked query result
  const capitalsMap = bindCapitalsResults(queryResult);

  // Assertions
  expect(capitalsMap).toBeInstanceOf(Map);
  expect(capitalsMap.size).toBe(2);
  expect(capitalsMap.get('France')).toBe('Paris');
  expect(capitalsMap.get('Germany')).toBe('Berlin');
});

it('should handle empty query result', () => {
  const lang = 'en';
  // Mock empty query result
  const queryResult = {
    results: { bindings: [] }
  };

  // Call the function with the empty query result
  const capitalsMap = bindCapitalsResults(queryResult);

  // Assertions
  expect(capitalsMap).toBeInstanceOf(Map);
  expect(capitalsMap.size).toBe(0);
});

})