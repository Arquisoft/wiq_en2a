const Game = require("./game-model")
const mongoose = require('mongoose');
const User = require("../../users/userservice/user-model");
const Question4Answers = require("../qgservice/Question4Answers");

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
        console.log("aqui")

        await User.updateMany(
          { _id: { $in: users.map(user => user._id) } },
          { $set: { lastGame: savedGame._id } },
          { multi: true }
        );

        const populatedGame = await Game.findById(savedGame._id).populate('players');
        // await savedGame.populate('questions').execPopulate();
        console.log(populatedGame);
        return savedGame;
      } catch (error) {
        console.error('Error creating game:', error);
        throw error;
      }
  }
  
  module.exports = {
    createGame,
  };