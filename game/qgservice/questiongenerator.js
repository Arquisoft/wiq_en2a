const Question4Answers = require('./Question4Answers');

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

  // Create the question object
  const question = {
    question: `What is the population of ${city}?`,
    correctAnswer: population.toString(),
    incorrectAnswer1: incorrectAnswers[0].toString(),
    incorrectAnswer2: incorrectAnswers[1].toString(),
    incorrectAnswer3: incorrectAnswers[2].toString(),
  };

  // Save the question to MongoDB
  const newQuestion = new Question4Answers(question);
  newQuestion.save()
    .then(savedQuestion => {
      console.log('Question saved to MongoDB:', savedQuestion);
    })
    .catch(error => {
      console.error('Error saving question to MongoDB:', error.message);
    });

  return question;
}

module.exports = {
  generateQuestionPopulation,
};