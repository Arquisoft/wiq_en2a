// sparqlQueries.js
const usaPopulationQuery = `
SELECT DISTINCT ?city ?cityLabel ?population ?country ?countryLabel
  WHERE {
    ?city wdt:P31/wdt:P279* wd:Q515.
    ?city wdt:P17 ?country.
    ?country wdt:P17 wd:Q30.
    OPTIONAL { ?city wdt:P1082 ?population. }
    FILTER (?population > 1000000) # Filter for cities with population > 1,000,000
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
  }
`;

module.exports = {
  usaPopulationQuery,
};
