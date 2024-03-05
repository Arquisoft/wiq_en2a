const mongoose = require('mongoose');



const gameSchema = new mongoose.Schema({
    id: {
      type: String,
      required: true,
    },
    player1:{
        type: mongoose.Schema.Types.ObjectId,ref:'User',
        required: true,
    },
    player1Points:{
        type: Number,
        required: true,
    },
    player2:{
        type: mongoose.Schema.Types.ObjectId,ref:'User'
    },
    player2Points:{
      type: Number,
    },
    player3:{
        type: mongoose.Schema.Types.ObjectId,ref:'User'
    },
    player3Points:{
      type: Number, 
    },
    questions:[
      {
        type: mongoose.Schema.Types.ObjectId,ref:'Question4Answers'
      }
    ],
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game