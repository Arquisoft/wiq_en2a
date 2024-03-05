const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    
    // many to one con group
    // many to one con lastgame
    // int preguntas acertadas
    // int preguntas falladas
    // int puntuacion

});

const User = mongoose.model('User', userSchema);

module.exports = User