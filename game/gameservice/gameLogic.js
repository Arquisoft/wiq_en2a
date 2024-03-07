const Game = require("./game-model")
const mongoose = require('mongoose');
const {userSchema} = require("../../users/userservice/user-model");
const {question4AnswersSchema} = require("../qgservice/Question4Answers");

async function createGame(questions, users) {
    try {
        var Question4Answers = mongoose.model('Question4Answers', question4AnswersSchema);
        var User = mongoose.model('User', userSchema);
        // Create a new Game instance
        const game = new Game({
          _id: new mongoose.Types.ObjectId(),
          players: users.map(user => user._id),
          questions: questions.map(question => question._id),
        });
    
        // Save the game to the database
        const savedGame = await game.save();

        users.forEach(async u => {
          await User.findOneAndUpdate({ _id: u._id }, { lastGame: savedGame._id } );
        });

        let populatedGame = await Game.findById(savedGame._id).populate('players').populate('questions');

        return populatedGame;
      } catch (error) {
        console.error('Error creating game:', error);
        throw error;
      }
  }
  
  module.exports = {
    createGame,
  };