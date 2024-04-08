const Question4Answers = require('../Question4Answers');
const mongoose = require('mongoose');
const uuid = require('uuid');

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
    uuid: uuid.v4(), 
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

function generateQuestionCapital(countryCapitalMap) {
  const countryCapitalArray = Array.from(countryCapitalMap);

  const randomIndex = Math.floor(Math.random() * countryCapitalArray.length);
  const [country, capital] = countryCapitalArray[randomIndex];

  const incorrectAnswers = [];
  while (incorrectAnswers.length < 3) {
    const randomCountry = countryCapitalArray[Math.floor(Math.random() * countryCapitalArray.length)];
    const [randomCountryName, randomCountryCapital] = randomCountry;
    if (randomCountryName !== country && !incorrectAnswers.includes(randomCountryCapital)) {
      incorrectAnswers.push(randomCountryCapital);
    }
  }

  // Create the question object
  const question = {
    uuid: uuid.v4(),
    question: `What is the capital of ${country}?`,
    correctAnswer: capital,
    incorrectAnswer1: incorrectAnswers[0],
    incorrectAnswer2: incorrectAnswers[1],
    incorrectAnswer3: incorrectAnswers[2],
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

  function generateQuestionChemical(chemicalElementMap) {
    const chemicalElementArray = Array.from(chemicalElementMap);
  
    const randomIndex = Math.floor(Math.random() * chemicalElementArray.length);
    const [ symbol, chemical] = chemicalElementArray[randomIndex];
  
    const incorrectAnswers = [];
    while (incorrectAnswers.length < 3) {
      const randomElement = chemicalElementArray[Math.floor(Math.random() * chemicalElementArray.length)];
      const [randomSymbol, randomElementName] = randomElement;
      if (randomElementName !== chemical && !incorrectAnswers.includes(randomSymbol)) {
        incorrectAnswers.push(randomSymbol);
      }
    }
  
    // Create the question object
    const question = {
      uuid: uuid.v4(),
      question: `What is the symbol of ${chemical}?`,
      correctAnswer: symbol,
      incorrectAnswer1: incorrectAnswers[0],
      incorrectAnswer2: incorrectAnswers[1],
      incorrectAnswer3: incorrectAnswers[2],
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

function generateQuestionMonument(monumentMap) {
  const monumentArray = Array.from(monumentMap);

  const randomIndex = Math.floor(Math.random() * monumentArray.length);
  const [ monumentLabel, countryLabel] = monumentArray[randomIndex];

  const incorrectAnswers = [];
  while (incorrectAnswers.length < 3) {
    const randomMonument = monumentArray[Math.floor(Math.random() * monumentArray.length)];
    const [randomMonumentLabel, randomCountry] = randomMonument;
    if (randomMonumentLabel !== monumentLabel && !incorrectAnswers.includes(randomCountry)) {
      incorrectAnswers.push(randomCountry);
    }
  }

  // Create the question object
  const question = {
    uuid: uuid.v4(),
    question: `Where is ${monumentLabel}?`,
    correctAnswer: countryLabel,
    incorrectAnswer1: incorrectAnswers[0],
    incorrectAnswer2: incorrectAnswers[1],
    incorrectAnswer3: incorrectAnswers[2],
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
  generateQuestionCapital,
  generateQuestionChemical,
  generateQuestionMonument
};