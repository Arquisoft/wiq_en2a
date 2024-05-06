const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Question4Answers = require('./Question4Answers');
const expectQuestionProperties = require('./test-utils/ExpectQuestionProperties')
const { generateQuestionCapital, generateQuestionPopulation, generateQuestionChemical, generateQuestionMonument } = require('./generatorLogic/questiongenerator')
const { executeSparqlQuery } = require('./generatorLogic/SparqlQuery')
const { bindCapitalsResults, bindPopulationResults, bindChemicalResults, bindMonumentResults } = require('./generatorLogic/BindResults')
const { createMathQuestions, generateRandomMathQuestion } = require('./generatorLogic/MathQuestions')
const axios = require('axios');
const { capitalQuestion, populationQuestion, chemicalQuestion, monumentQuestion } = require('./generatorLogic/questionLanguage')
const {capitalTestData,chemicalTestData,monumentTestData,populationTestData} = require('./test-utils/BindTestResults')

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

it('should generate a math question with valid operands and operator', () => {

  const mathQuestion = generateRandomMathQuestion();

  expect(mathQuestion).toHaveProperty('uuid');
  expect(mathQuestion).toHaveProperty('question');
  expect(mathQuestion).toHaveProperty('correctAnswer');
  expect(mathQuestion).toHaveProperty('incorrectAnswer1'); 
  expect(mathQuestion).toHaveProperty('incorrectAnswer2');
  expect(mathQuestion).toHaveProperty('incorrectAnswer3');

  const [operand1, operator, operand2] = mathQuestion.question.split(' ');

  expect(parseInt(operand1)).toBeGreaterThanOrEqual(1);
  expect(parseInt(operand1)).toBeLessThanOrEqual(100);
  expect(parseInt(operand2)).toBeGreaterThanOrEqual(1);
  expect(parseInt(operand2)).toBeLessThanOrEqual(100);

  expect(['+', '-', '*', '/']).toContain(operator);

  const correctAnswer = eval(mathQuestion.question);
  expect(mathQuestion.correctAnswer).toEqual(correctAnswer.toString());

  expect(mathQuestion.incorrectAnswer1).not.toEqual(correctAnswer.toString());
  expect(mathQuestion.incorrectAnswer2).not.toEqual(correctAnswer.toString());
  expect(mathQuestion.incorrectAnswer3).not.toEqual(correctAnswer.toString());
});

it('should create math questions and return them', async () => {
  const numberOfQuestions = 3;

  const result = await createMathQuestions(numberOfQuestions);

  expect(Array.isArray(result)).toBe(true);
  expect(result.length).toBe(3);

  result.forEach((question) => {
    expect(question).toHaveProperty('correctAnswer');
    expect(question).toHaveProperty('incorrectAnswer1');
    expect(question).toHaveProperty('incorrectAnswer2');
    expect(question).toHaveProperty('incorrectAnswer3');
    expect(question).toHaveProperty('question');
    expect(question).toHaveProperty('uuid');
    expect(typeof question.correctAnswer).toBe('string');
    expect(typeof question.incorrectAnswer1).toBe('string');
    expect(typeof question.incorrectAnswer2).toBe('string');
    expect(typeof question.incorrectAnswer3).toBe('string');
    expect(typeof question.question).toBe('string');
    expect(typeof question.uuid).toBe('string');
  });
});

it('should bind query results to a Map of populations', () => {

  // Call the function with the mocked query result
  const populationMap = bindPopulationResults(populationTestData);

  // Assertions
  expect(populationMap).toBeInstanceOf(Map);
  expect(populationMap.size).toBe(4);
  expect(populationMap.get('Tokyo')).toBe(13929286);
  expect(populationMap.get('Delhi')).toBe(18978000);
  expect(populationMap.get('Madrid')).toBe(3550000);
});

it('should handle empty query result', () => {
  // Mock empty query result
  const queryResult = {
    results: { bindings: [] }
  };

  // Call the function with the empty query result
  const populationMap = bindPopulationResults(queryResult);

  // Assertions
  expect(populationMap).toBeInstanceOf(Map);
  expect(populationMap.size).toBe(0);
});

it('should bind query results to a Map of chemical elements', () => {

  // Call the function with the mocked query result
  const chemicalElementMap = bindChemicalResults(chemicalTestData);

  // Assertions
  expect(chemicalElementMap).toBeInstanceOf(Map);
  expect(chemicalElementMap.size).toBe(4);
  expect(chemicalElementMap.get('H')).toBe('Hydrogen');
  expect(chemicalElementMap.get('O')).toBe('Oxygen');
  expect(chemicalElementMap.get('C')).toBe('Carbon');
});

it('should handle empty query result', () => {
  // Mock empty query result
  const queryResult = {
    results: { bindings: [] }
  };

  // Call the function with the empty query result
  const chemicalElementMap = bindChemicalResults(queryResult);

  // Assertions
  expect(chemicalElementMap).toBeInstanceOf(Map);
  expect(chemicalElementMap.size).toBe(0);
});

it('should bind query results to a Map of monuments', () => {

  // Call the function with the mocked query result
  const monumentMap = bindMonumentResults(monumentTestData);

  // Assertions
  expect(monumentMap).toBeInstanceOf(Map);
  expect(monumentMap.size).toBe(4);
  expect(monumentMap.get('Eiffel Tower')).toBe('France');
  expect(monumentMap.get('Taj Mahal')).toBe('India');
  expect(monumentMap.get('Statue of Liberty')).toBe('United States');
  expect(monumentMap.get('Great Wall of China')).toBe('China');
});

it('should handle empty query result', () => {
  // Mock empty query result
  const queryResult = {
    results: { bindings: [] }
  };

  // Call the function with the empty query result
  const monumentMap = bindMonumentResults(queryResult);

  // Assertions
  expect(monumentMap).toBeInstanceOf(Map);
  expect(monumentMap.size).toBe(0);
});

it('should generate a population question with valid data', () => {
  const cityPopulationMap = bindPopulationResults(populationTestData);
  const question = generateQuestionPopulation(cityPopulationMap, 'en');

  expectQuestionProperties(question)
});

it('should handle error when saving question to MongoDB', async () => {
  const queryResult = {
    results: {
      bindings: [
        { cityLabel: { value: 'Tokyo' }, population: { value: '13929286' } },
        { cityLabel: { value: 'Delhi' }, population: { value: '18978000' } },
        { cityLabel: { value: 'Shanghai' }, population: { value: '24150000' } },
        { cityLabel: { value: 'Madrid' }, population: { value: '3550000' } }
      ]
    }
  };

  const cityPopulationMap = bindPopulationResults(queryResult);

  const mockSaveError = new Error('Failed to save question');
  jest.spyOn(Question4Answers.prototype, 'save').mockRejectedValue(mockSaveError);

  try {
    await generateQuestionPopulation(cityPopulationMap, 'en');
  } catch (error) {
    expect(error).toBe(mockSaveError);
    expect(console.error).toHaveBeenCalledWith('Error saving question to MongoDB:', mockSaveError.message);
  }
});

it('should generate a capital question with valid data', () => {
  // Call the function with the mocked query result
  const countryCapitalMap = bindCapitalsResults(capitalTestData);

  const question = generateQuestionCapital(countryCapitalMap, 'en');

  expectQuestionProperties(question)
});

it('should handle error when saving question to MongoDB', async () => {
  const capitalsMap = bindCapitalsResults(capitalTestData);

  const mockSaveError = new Error('Failed to save question');
  jest.spyOn(Question4Answers.prototype, 'save').mockRejectedValue(mockSaveError);

  try {
    await generateQuestionCapital(capitalsMap, 'en');
  } catch (error) {
    expect(error).toBe(mockSaveError);
    expect(console.error).toHaveBeenCalledWith('Error saving question to MongoDB:', mockSaveError.message);
  }
});

it('should generate a chemical question with valid data', () => {
  // Call the function with the mocked query result
  const chemicalElementMap = bindChemicalResults(chemicalTestData);

  const question = generateQuestionChemical(chemicalElementMap, 'en');

  // Assertions
  expectQuestionProperties(question)
});

it('should handle error when saving question to MongoDB', async () => {
  const queryResult = {
    results: {
      bindings: [
        { elementLabel: { value: 'Oxygen' }, symbol: { value: 'O' } },
        { elementLabel: { value: 'Hydrogen' }, symbol: { value: 'H' } },
        { elementLabel: { value: 'Carbon' }, symbol: { value: 'C' } },
        { elementLabel: { value: 'Nitrogen' }, symbol: { value: 'N' } }
      ]
    }
  };

  const chemicalsMap = bindChemicalResults(queryResult);

  const mockSaveError = new Error('Failed to save question');
  jest.spyOn(Question4Answers.prototype, 'save').mockRejectedValue(mockSaveError);

  try {
    await generateQuestionChemical(chemicalsMap, 'en');
  } catch (error) {
    expect(error).toBe(mockSaveError);
    expect(console.error).toHaveBeenCalledWith('Error saving question to MongoDB:', mockSaveError.message);
  }
});

it('should generate a monument question with valid data', () => {
  // Call the function with the mocked query result
  const monumentMap = bindMonumentResults(monumentTestData);

  const question = generateQuestionMonument(monumentMap, 'en');

  // Assertions
  expectQuestionProperties(question)
});

it('should handle error when saving question to MongoDB', async () => {
  const monumentsMap = bindMonumentResults(monumentTestData);

  const mockSaveError = new Error('Failed to save question');
  jest.spyOn(Question4Answers.prototype, 'save').mockRejectedValue(mockSaveError);

  try {
    await generateQuestionMonument(monumentsMap, 'en');
  } catch (error) {
    expect(error).toBe(mockSaveError);
    expect(console.error).toHaveBeenCalledWith('Error saving question to MongoDB:', mockSaveError.message);
  }
})

it('should return the capital question in English', () => {
  const lang = 'en';
  const country = 'France';
  const expectedQuestion = 'What is the capital of France?';
  const question = capitalQuestion(lang, country);
  expect(question).toBe(expectedQuestion);
});

it('should return the capital question in Spanish', () => {
  const lang = 'es';
  const country = 'France';
  const expectedQuestion = '¿Cual es la capital de France?';
  const question = capitalQuestion(lang, country);
  expect(question).toBe(expectedQuestion);
});

it('should return the population question in English', () => {
  const lang = 'en';
  const city = 'Tokyo';
  const expectedQuestion = 'What is the population of Tokyo?';
  const question = populationQuestion(lang, city);
  expect(question).toBe(expectedQuestion);
});

it('should return the population question in Spanish', () => {
  const lang = 'es';
  const city = 'Tokyo';
  const expectedQuestion = '¿Cual es la población de Tokyo?';
  const question = populationQuestion(lang, city);
  expect(question).toBe(expectedQuestion);
});

it('should return the chemical question in English', () => {
  const lang = 'en';
  const chemical = 'Oxygen';
  const expectedQuestion = 'What is the chemical symbol of Oxygen?';
  const question = chemicalQuestion(lang, chemical);
  expect(question).toBe(expectedQuestion);
});

it('should return the chemical question in Spanish', () => {
  const lang = 'es';
  const chemical = 'Oxygen';
  const expectedQuestion = '¿Cual es el símbolo químico de Oxygen?';
  const question = chemicalQuestion(lang, chemical);
  expect(question).toBe(expectedQuestion);
});

it('should return the monument question in English', () => {
  const lang = 'en';
  const monument = 'Eiffel Tower';
  const expectedQuestion = 'Where is Eiffel Tower?';
  const question = monumentQuestion(lang, monument);
  expect(question).toBe(expectedQuestion);
});

it('should return the monument question in Spanish', () => {
  const lang = 'es';
  const monument = 'Eiffel Tower';
  const expectedQuestion = '¿Dónde está Eiffel Tower?';
  const question = monumentQuestion(lang, monument);
  expect(question).toBe(expectedQuestion);
});


})