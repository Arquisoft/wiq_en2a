// qg-service.js
require('dotenv').config();
// const OpenAI = require('openai')
const express = require('express');
// const bodyParser = require('body-parser');
const axios = require('axios');
const mongoose = require('mongoose');
const { worldPopulationQuery, spainPopulationQuery, spainCapitalQuery, worldCapitalQuery } = require('./queries');
const { generateQuestionPopulation, generateQuestionCapital } = require('./questiongenerator');
const { createMathQuestions } = require('./MathQuestions');

const app = express();
const port = 8003;

// app.use(bodyParser.json());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
mongoose.connect(mongoUri);
// const openai = new OpenAI();
// 

async function executeSparqlQuery(query) {
  try {
    const response = await axios.get('https://query.wikidata.org/sparql', {
      headers: {
        'User-Agent': 'Your User Agent',
        'Accept': 'application/json',
      },
      params: {
        query: query,
        format: 'json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error executing SPARQL query:', error.message);
    throw error;
  }
}

app.get('/', (req, res) => {
  res.json({
    "hi": "question generator"
  });
});

app.get('/game', async (req, res) => {
  try {

    // 2 preguntas capitales comunidades autonomas españa
    const spainQueryResult = await executeSparqlQuery(spainCapitalQuery);
    const spainCapitals = new Map();

    spainQueryResult.results.bindings.forEach(entry => {
      const comAutonomaLabel = entry.countryLabel.value;
      const capital = entry.capitalLabel.value;
      spainCapitals.set(comAutonomaLabel, capital);
    });

    const numberOfQuestionsSpainCapital = 2;
    const questions = [];

    for (let i = 0; i < numberOfQuestionsSpainCapital; i++) {
      const question = generateQuestionCapital(spainCapitals);
      questions.push(question);
    }

    // 2 preguntas capitales mundo
    const worldQueryResult = await executeSparqlQuery(worldCapitalQuery);
    const worldCapitals = new Map();

    worldQueryResult.results.bindings.forEach(entry => {
      const countryLabel = entry.countryLabel.value;
      const capital = entry.capitalLabel.value;
      worldCapitals.set(countryLabel, capital);
    });

    const numberOfQuestionsWorldCapital = 2;

    for (let i = 0; i < numberOfQuestionsWorldCapital; i++) {
      const question = generateQuestionCapital(worldCapitals);
      questions.push(question);
    }

    // 5 preguntas poblacion mundo
    const worldPopulationResult = await executeSparqlQuery(worldPopulationQuery);
    const worldPopulation = new Map();

    worldPopulationResult.results.bindings.forEach(entry => {
      const cityLabel = entry.cityLabel.value;
      const population = parseFloat(entry.population.value);
      worldPopulation.set(cityLabel, population);
    });

    const numberOfQuestionsWorldPopulation = 5;

    for (let i = 0; i < numberOfQuestionsWorldPopulation; i++) {
      const question = generateQuestionPopulation(worldPopulation);
      questions.push(question);
    }

    const mathquestions = await createMathQuestions(5)
    questions.push(...mathquestions)


    res.json(questions);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
})


const server = app.listen(port, () => {
  console.log(`Question generator Service listening at http://localhost:${port}`);
});

module.exports = server;
