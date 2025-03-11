// models/QuizQuestion.js
const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  correctAnswer: { type: String, required: true },
  wrongAnswers: {
    type: [String],
    validate: [arr => arr.length === 3, 'Must have exactly 3 wrong answers'],
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizQuestion', quizQuestionSchema);
