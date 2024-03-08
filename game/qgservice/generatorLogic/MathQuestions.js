const Question4Answers = require("../Question4Answers");
const mongoose = require("mongoose");
const uuid = require("uuid");

function generateRandomMathQuestion() {
    const operators = ['+', '-', '*', '/'];
  
    const operator = operators[Math.floor(Math.random() * operators.length)];
    let num1 = Math.floor(Math.random() * 100) + 1;
    let num2 = Math.floor(Math.random() * 100) + 1;
  
    // Ensure division results in integers
    if (operator === '/' && num2 !== 0) {
      const divisionResult = num1 / num2;
      num1 = divisionResult * num2; // Adjust num1 to get an integer result
    }
  
    const question = `${num1} ${operator} ${num2}`;
    const correctAnswer = eval(question).toString();
  
    // Generate incorrect answers
    const incorrectAnswers = [];
    while (incorrectAnswers.length < 3) {
      const randomAnswer = Math.floor(Math.random() * 200) - 100; // Random integer between -100 and 100
      if (incorrectAnswers.indexOf(randomAnswer.toString()) === -1 && randomAnswer.toString() !== correctAnswer) {
        incorrectAnswers.push(randomAnswer.toString());
      }
    }
  
    return {
      uuid: uuid.v4(),
      question,
      correctAnswer,
      incorrectAnswer1: incorrectAnswers[0],
      incorrectAnswer2: incorrectAnswers[1],
      incorrectAnswer3: incorrectAnswers[2],
    };
  }

  async function createMathQuestions(numberOfQuestions) {
    const questions = [];
  
    for (let i = 0; i < numberOfQuestions; i++) {
      const mathQuestion = generateRandomMathQuestion();
      questions.push(mathQuestion);
    }
  
    try {
      const savedQuestions = await Question4Answers.insertMany(questions);
      console.log(`${numberOfQuestions} math questions saved to MongoDB:`, savedQuestions);
      return questions;
    } catch (error) {
      console.error('Error saving math questions to MongoDB:', error.message);
    }
  }

module.exports = { createMathQuestions };