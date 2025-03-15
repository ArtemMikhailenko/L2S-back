// routes/quiz.js
const express = require('express');
const QuizQuestion = require('../models/QuizQuestion');
const router = express.Router();

/* Helper function defined above */
function transformQuestion(doc, lang = 'en') {
  return {
    _id: doc._id,
    question: doc.question[lang],
    correctAnswer: doc.correctAnswer[lang],
    wrongAnswers: doc.wrongAnswers.map(ans => ans[lang]),
    createdAt: doc.createdAt,
  };
}

// Create a new question
// The request body must contain objects for each language, e.g.:
// {
//   "question": { "en": "What is 2+2?", "ar": "ما هو ٢+٢؟" },
//   "correctAnswer": { "en": "4", "ar": "٤" },
//   "wrongAnswers": [
//      { "en": "3", "ar": "٣" },
//      { "en": "5", "ar": "٥" },
//      { "en": "6", "ar": "٦" }
//   ]
// }
router.post('/questions', async (req, res) => {
  try {
    const { question, correctAnswer, wrongAnswers } = req.body;
    
    if (!question || !correctAnswer || !wrongAnswers) {
      return res.status(400).json({ message: 'question, correctAnswer, and wrongAnswers are required' });
    }
    
    if (!Array.isArray(wrongAnswers) || wrongAnswers.length !== 3) {
      return res.status(400).json({ message: 'wrongAnswers must be an array of 3 objects with language keys' });
    }
    
    const newQuestion = new QuizQuestion({
      question,
      correctAnswer,
      wrongAnswers
    });
    
    await newQuestion.save();
    
    return res.status(201).json({
      message: 'Question created successfully',
      question: newQuestion
    });
  } catch (error) {
    console.error('Error creating question:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get questions with filtering and pagination
router.get('/questions', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      sort = 'createdAt', 
      order = 'desc',
      lang = 'en'
    } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
      return res.status(400).json({ message: 'Invalid page or limit parameters' });
    }
    
    // Build query: search in both languages
    const query = {};
    if (search) {
      query.$or = [
        { "question.en": { $regex: search, $options: 'i' } },
        { "question.ar": { $regex: search, $options: 'i' } },
        { "correctAnswer.en": { $regex: search, $options: 'i' } },
        { "correctAnswer.ar": { $regex: search, $options: 'i' } }
      ];
    }
    
    const totalQuestions = await QuizQuestion.countDocuments(query);
    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;
    
    const docs = await QuizQuestion.find(query)
      .sort(sortObj)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);
    
    const questions = docs.map(doc => transformQuestion(doc, lang));
    
    return res.json({
      questions,
      totalQuestions,
      currentPage: pageNum,
      totalPages: Math.ceil(totalQuestions / limitNum),
      hasNextPage: pageNum < Math.ceil(totalQuestions / limitNum),
      hasPrevPage: pageNum > 1
    });
  } catch (error) {
    console.error('Error retrieving questions:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a random set of questions
router.get('/questions/random', async (req, res) => {
  try {
    const { limit = 15, lang = 'en' } = req.query;
    const limitNum = parseInt(limit);
    
    if (isNaN(limitNum) || limitNum < 1) {
      return res.status(400).json({ message: 'Invalid limit parameter' });
    }
    
    const docs = await QuizQuestion.aggregate([
      { $sample: { size: limitNum } }
    ]);
    
    // Aggregate returns plain objects, so manually transform:
    const questions = docs.map(doc => transformQuestion(doc, lang));
    return res.json(questions);
  } catch (error) {
    console.error('Error retrieving random questions:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get question by ID
router.get('/questions/:id', async (req, res) => {
  try {
    const { lang = 'en' } = req.query;
    const doc = await QuizQuestion.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: 'Question not found' });
    }
    const question = transformQuestion(doc, lang);
    return res.json(question);
  } catch (error) {
    console.error('Error retrieving question by ID:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update question by ID
router.put('/questions/:id', async (req, res) => {
  try {
    const { question, correctAnswer, wrongAnswers } = req.body;
    const doc = await QuizQuestion.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: 'Question not found' });
    }
    if (question !== undefined) doc.question = question;
    if (correctAnswer !== undefined) doc.correctAnswer = correctAnswer;
    if (wrongAnswers !== undefined) {
      if (!Array.isArray(wrongAnswers) || wrongAnswers.length !== 3) {
        return res.status(400).json({ message: 'wrongAnswers must be an array of 3 objects with language keys' });
      }
      doc.wrongAnswers = wrongAnswers;
    }
    await doc.save();
    return res.json({
      message: 'Question updated successfully',
      question: doc
    });
  } catch (error) {
    console.error('Error updating question:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete question by ID
router.delete('/questions/:id', async (req, res) => {
  try {
    const doc = await QuizQuestion.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: 'Question not found' });
    }
    return res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send tokens at the end of quiz (this endpoint remains as-is)
const { sendTokensToWallet } = require('../utils/tonTransactions');
router.post('/complete', async (req, res) => {
  try {
    const { address, telegramId, correctAnswers, totalQuestions } = req.body;
    
    if ((!address && !telegramId) || correctAnswers === undefined || totalQuestions === undefined) {
      return res.status(400).json({ 
        message: 'Either address or telegramId, along with correctAnswers and totalQuestions are required' 
      });
    }
    
    const incorrectAnswers = totalQuestions - correctAnswers;
    const tokenAmount = (correctAnswers * 5) + (incorrectAnswers * 1);
    
    const result = await sendTokensToWallet(address || telegramId, tokenAmount);
    
    if (!result.success) {
      return res.status(500).json({ message: 'Failed to send tokens', error: result.error });
    }
    
    return res.json({
      message: 'Quiz completed successfully',
      tokensSent: tokenAmount,
      txHash: result.txHash
    });
  } catch (error) {
    console.error('Error completing quiz:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
