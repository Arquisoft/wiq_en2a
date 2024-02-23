// questionGenerator.js
function generateQuestionPopulation(cityPopulationMap) {
    const cityPopulationArray = Array.from(cityPopulationMap);
  
    const randomIndex = Math.floor(Math.random() * cityPopulationArray.length);
    const [city, population] = cityPopulationArray[randomIndex];
  
    const incorrectAnswers = [];
    while (incorrectAnswers.length < 3) {
      const randomCity = cityPopulationArray[Math.floor(Math.random() * cityPopulationArray.length)];
      const [randomCityName, randomCityPopulation] = randomCity;
      if (randomCityName !== city && !incorrectAnswers.includes(randomCityPopulation)) {
        incorrectAnswers.push(randomCityPopulation);
      }
    }
  
    const question = {
      question: `What is the population of ${city}?`,
      correctAnswer: population,
      incorrectAnswers,
    };
  
    return question;
  }
  
  module.exports = {
    generateQuestionPopulation,
  };
  