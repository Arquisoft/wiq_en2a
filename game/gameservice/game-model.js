const mongoose = require('mongoose');



const gameSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
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