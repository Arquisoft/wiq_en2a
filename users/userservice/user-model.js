const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uuid: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
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
    nCorrectAnswers: {
      type: Number,
      required: false,
    },
    nWrongAnswers: {
      type: Number,
      required: false,
    },
    totalScore: {
      type: Number,
      required: false,
    },
    nWins: {
      type: Number,
      required: false,
    },
    groupName:{
      type: String,
      required: false,
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;