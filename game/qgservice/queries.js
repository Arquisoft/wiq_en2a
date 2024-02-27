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

const spainPopulationQuery = `
SELECT DISTINCT ?city ?cityLabel ?population ?country ?countryLabel
WHERE {
  ?city wdt:P31/wdt:P279* wd:Q515.
  ?city wdt:P17 ?country.
  ?country wdt:P17 wd:Q29.
  OPTIONAL { ?city wdt:P1082 ?population. }
  FILTER (?population > 100000) # Filter for cities with population > 1,000,000
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
`

const worldCapitalQuery = `
SELECT ?country ?countryLabel ?capital ?capitalLabel WHERE {
  ?country wdt:P31 wd:Q6256;
        wdt:P36 ?capital.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
`

// Utilizar country en vez de comunidad para poder reaprovechar codigo
const spainCapitalQuery = `
SELECT ?country ?countryLabel ?capital ?capitalLabel WHERE {
  ?country wdt:P31 wd:Q10742;
    wdt:P36 ?capital;
    wdt:P17 wd:Q29.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
`



const chatgptPrompt = `
Hi, I want you to generate trivia questions, with 1 correct answer and 3 incorrect. Please format them as:
question: *question*
correctAnswer: *correct answer*
incorrectAnswer1: *incorrect Answer*
incorrectAnswer2: *incorrect Answer 2*
incorrectAnswer3: *incorrect Answer 3*

Please generate 19 random questions
`

module.exports = {
  usaPopulationQuery,
  spainPopulationQuery,
  chatgptPrompt
};
