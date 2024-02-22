// qg-service.js
const express = require('express');
//const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');

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

// Connect to MongoDB
//const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
//mongoose.connect(mongoUri);

const sparqlQuery = `
  SELECT DISTINCT ?city ?cityLabel ?population
  WHERE {
    ?city wdt:P31/wdt:P279* wd:Q515.
    ?city wdt:P17 wd:Q29.
    OPTIONAL { ?city wdt:P1082 ?population. }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
  }
`;

// Define the route to handle the SPARQL query
app.get('/sparql', async (req, res) => {
  try {
    const sparqlResult = await executeSparqlQuery(sparqlQuery);
    res.json(sparqlResult);
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

// Listen for the 'close' event on the Express.js server
server.on('close', () => {
  // Close the Mongoose connection
  mongoose.connection.close();
});

module.exports = server;
