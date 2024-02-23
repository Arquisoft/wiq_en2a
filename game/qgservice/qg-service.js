// qg-service.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { usaPopulationQuery } = require('./queries'); 

const app = express();
const port = 8003;

// Middleware to parse JSON in request body
app.use(bodyParser.json());

async function executeSparqlQuery(query) {
  try {
    const response = await axios.get('https://query.wikidata.org/sparql', {
      headers: {
        'User-Agent': 'Your User Agent', // Add your user agent here
        'Accept': 'application/json',
      },
      params: {
        query: query,
        format: 'json',
      },
    });

    // Return the data instead of logging
    return response.data;
  } catch (error) {
    console.error('Error executing SPARQL query:', error.message);
    throw error; // Rethrow the error to handle it in the calling function
  }
}

function generateQuestion(cityPopulationMap) {
  // Convert the Map to an array for easier manipulation
  const cityPopulationArray = Array.from(cityPopulationMap);

  // Randomly choose a city from the array
  const randomIndex = Math.floor(Math.random() * cityPopulationArray.length);
  const [city, population] = cityPopulationArray[randomIndex];

  // Generate incorrect answers by selecting random populations from other cities
  const incorrectAnswers = [];
  while (incorrectAnswers.length < 3) {
    const randomCity = cityPopulationArray[Math.floor(Math.random() * cityPopulationArray.length)];
    const [randomCityName, randomCityPopulation] = randomCity;
    if (randomCityName !== city && !incorrectAnswers.includes(randomCityPopulation)) {
      incorrectAnswers.push(randomCityPopulation);
    }
  }

  // Create the question object
  const question = {
    question: `What is the population of ${city}?`,
    correctAnswer: population,
    incorrectAnswers,
  };

  return question;
}

// Define the route to handle the SPARQL query
app.get('/sparql', async (req, res) => {
  try {
    const sparqlResult = await executeSparqlQuery(usaPopulationQuery);
    const cityPopulation = new Map();

    sparqlResult.results.bindings.forEach(entry => {
      const cityLabel = entry.cityLabel.value;
      const population = parseFloat(entry.population.value);
      cityPopulation.set(cityLabel, population);
    });
    const question = generateQuestion(cityPopulation);
    // console.log(question)
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
