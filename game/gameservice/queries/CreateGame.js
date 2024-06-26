const Game = require("../game-model")
const mongoose = require('mongoose');
const uuid = require('uuid')

async function createGame(questions, players) {
    try {
        // Create a new Game instance
        if(players.length === 0){
          throw new Error('No players found')
        }
        if(players[0].uuid === null || players[0].uuid === undefined){
          throw new Error('No players found')
        }
        const game = new Game({
          uuid: uuid.v4(),
          players: players.map(user => user.uuid),
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