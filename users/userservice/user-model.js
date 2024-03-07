const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
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
    lastGame: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: false,
    },
    
    // many to one con group
    // int preguntas acertadas
    // int preguntas falladas
    // int puntuacion

});

const User = mongoose.model('User', userSchema);

module.exports = {User,userSchema};