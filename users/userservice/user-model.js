const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uuid: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now, 
    },
    lastGameId: {
      type: String,
      required: false,
    },
    
    // many to one con group
    // int preguntas acertadas
    // int preguntas falladas
    // int puntuacion

});

const User = mongoose.model('User', userSchema);

module.exports = User;