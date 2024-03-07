const mongoose = require('mongoose');



const gameSchema = new mongoose.Schema({
    id: {
      type: String,
      required: true,
    },
    players:[{
        type: mongoose.Schema.Types.ObjectId,ref:'User',
        required: true,
    }],
    questions:[
      {
        type: mongoose.Schema.Types.ObjectId,ref:'Question4Answers'
      }
    ],
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game