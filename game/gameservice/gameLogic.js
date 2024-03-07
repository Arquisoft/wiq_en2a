const Game = require("./game-model")
const mongoose = require('mongoose');
const {User} = require("../../users/userservice/user-model");
const {Question4Answers} = require("../qgservice/Question4Answers");

async function createGame(questions, users) {
    try {
        // Create a new Game instance
        const game = new Game({
          _id: new mongoose.Types.ObjectId(),
          players: users.map(user => user._id),
          questions: questions.map(question => question._id),
        });
    
        // Save the game to the database
        const savedGame = await game.save();

        let populatedGame = await Game.findById(savedGame._id).populate('players').populate('questions').exec();

        return populatedGame;
      } catch (error) {
        console.error('Error creating game:', error);
        throw error;
      }
  }
  
  module.exports = {
    createGame,
  };