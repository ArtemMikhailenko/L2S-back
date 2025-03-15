// models/QuizQuestion.js
const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  question: {
    en: { type: String, required: true },
    ar: { type: String, required: true },
  },
  correctAnswer: {
    en: { type: String, required: true },
    ar: { type: String, required: true },
  },
  wrongAnswers: [{
    en: { type: String, required: true },
    ar: { type: String, required: true },
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizQuestion', quizQuestionSchema);
