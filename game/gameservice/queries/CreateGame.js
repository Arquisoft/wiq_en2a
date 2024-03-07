const Game = require("../game-model")
const mongoose = require('mongoose');
const uuid = require('uuid')

async function createGame(questions, users) {
    try {
        // Create a new Game instance
        const game = new Game({
          uuid: uuid.v4(),
          players: users.map(user => user.uuid),
          questions: questions.map(question => question.uuid),
        });
        // Save the game to the database
        const savedGame = await game.save();

        return savedGame;
      } catch (error) {
        console.error('Error creating game:', error);
        throw error;
      }
  }
  
  module.exports = {
    createGame,
  };