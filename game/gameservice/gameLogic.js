const Game = require("./game-model")
const mongoose = require('mongoose');

async function createGame(questions, users) {
    try {
        // Create a new Game instance
        const game = new Game({
          _id: new mongoose.Types.ObjectId(),
          players: users,
          questions: questions,
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