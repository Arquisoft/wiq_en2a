// qg-service.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { usaPopulationQuery, spainPopulationQuery } = require('./queries');
const { generateQuestionPopulation } = require('./questiongenerator');

const app = express();
const port = 8003;

app.use(bodyParser.json());

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

app.get('/usaPopulation', async (req, res) => {
  try {
    const sparqlResult = await executeSparqlQuery(usaPopulationQuery);
    const cityPopulation = new Map();

    sparqlResult.results.bindings.forEach(entry => {
      const cityLabel = entry.cityLabel.value;
      const population = parseFloat(entry.population.value);
      cityPopulation.set(cityLabel, population);
    });

    const question = generateQuestionPopulation(cityPopulation);
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/spainPopulation', async (req, res) => {
  try {
    const sparqlResult = await executeSparqlQuery(spainPopulationQuery);
    const cityPopulation = new Map();

    sparqlResult.results.bindings.forEach(entry => {
      const cityLabel = entry.cityLabel.value;
      const population = parseFloat(entry.population.value);
      cityPopulation.set(cityLabel, population);
    });

    const question = generateQuestionPopulation(cityPopulation);
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/', (req, res) => {
  res.json({
    "hi": "question generator"
  });
});

const server = app.listen(port, () => {
  console.log(`Question generator Service listening at http://localhost:${port}`);
});

module.exports = server;
