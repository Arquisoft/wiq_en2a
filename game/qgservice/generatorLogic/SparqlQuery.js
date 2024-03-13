const axios = require('axios');

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

module.exports = { executeSparqlQuery };