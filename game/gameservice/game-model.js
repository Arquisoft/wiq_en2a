const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    uuid: {
      type: String,
      required: true,
    },
    players:[{
        type: String,
        required: true,
    }],
    questions:[
      {
        type: String,
        required: true,
      }
    ],
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game