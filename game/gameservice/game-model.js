const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    // ONE TO MANY CON QUESTIONS
    // ONE TO MANY CON USERS
});


const Game = mongoose.model('Game', gameSchema);

module.exports = Game