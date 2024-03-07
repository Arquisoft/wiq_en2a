const mongoose = require('mongoose');

const question4AnswersSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  question: {
    type: String,
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  incorrectAnswer1: {
    type: String,
    required: true,
  },
  incorrectAnswer2: {
    type: String,
    required: true,
  },
  incorrectAnswer3: {
    type: String,
    required: true,
  },
});

const Question4Answers = mongoose.model('Question4Answers', question4AnswersSchema);

module.exports = Question4Answers;