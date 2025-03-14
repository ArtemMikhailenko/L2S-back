const express = require('express');
const QuizQuestion = require('../models/QuizQuestion');
const router = express.Router();
const { sendTokensToWallet } = require('../utils/tonTransactions');

// Create a new question
router.post('/questions', async (req, res) => {
  try {
    const { question, correctAnswer, wrongAnswers } = req.body;
    
    if (!question || !correctAnswer || !wrongAnswers) {
      return res.status(400).json({ message: 'question, correctAnswer, and wrongAnswers are required' });
    }
    
    // Check that wrongAnswers is an array of three strings
    if (!Array.isArray(wrongAnswers) || wrongAnswers.length !== 3) {
      return res.status(400).json({ message: 'wrongAnswers must be an array of 3 strings' });
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
    // Extract query parameters
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      sort = 'createdAt', 
      order = 'desc' 
    } = req.query;
    
    // Convert page and limit to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    // Validate page and limit
    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
      return res.status(400).json({ message: 'Invalid page or limit parameters' });
    }
    
    // Build query
    const query = {};
    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { correctAnswer: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Count total documents
    const totalQuestions = await QuizQuestion.countDocuments(query);
    
    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;
    
    // Execute query with pagination
    const questions = await QuizQuestion.find(query)
      .sort(sortObj)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);
    
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
    const { limit = 15 } = req.query;
    const limitNum = parseInt(limit);
    
    if (isNaN(limitNum) || limitNum < 1) {
      return res.status(400).json({ message: 'Invalid limit parameter' });
    }
    
    // Get random questions
    const questions = await QuizQuestion.aggregate([
      { $sample: { size: limitNum } }
    ]);
    
    return res.json(questions);
  } catch (error) {
    console.error('Error retrieving random questions:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get question by ID
router.get('/questions/:id', async (req, res) => {
  try {
    const question = await QuizQuestion.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    return res.json(question);
  } catch (error) {
    console.error('Error retrieving question by ID:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update question
router.put('/questions/:id', async (req, res) => {
  try {
    const { question, correctAnswer, wrongAnswers } = req.body;
    
    // Find question by ID
    const existingQuestion = await QuizQuestion.findById(req.params.id);
    if (!existingQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Update fields if provided
    if (question !== undefined) existingQuestion.question = question;
    if (correctAnswer !== undefined) existingQuestion.correctAnswer = correctAnswer;
    if (wrongAnswers !== undefined) {
      // Check format
      if (!Array.isArray(wrongAnswers) || wrongAnswers.length !== 3) {
        return res.status(400).json({ message: 'wrongAnswers must be an array of 3 strings' });
      }
      existingQuestion.wrongAnswers = wrongAnswers;
    }
    
    await existingQuestion.save();
    
    return res.json({
      message: 'Question updated successfully',
      question: existingQuestion
    });
  } catch (error) {
    console.error('Error updating question:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete question
router.delete('/questions/:id', async (req, res) => {
  try {
    const result = await QuizQuestion.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Question not found' });
    }
    return res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send tokens at the end of quiz
router.post('/complete', async (req, res) => {
  try {
    const { address, telegramId, correctAnswers, totalQuestions } = req.body;
    
    if ((!address && !telegramId) || correctAnswers === undefined || totalQuestions === undefined) {
      return res.status(400).json({ 
        message: 'Either address or telegramId, along with correctAnswers and totalQuestions are required' 
      });
    }
    
    // Calculate rewards: 5 for correct answers, 1 for incorrect
    const incorrectAnswers = totalQuestions - correctAnswers;
    const tokenAmount = (correctAnswers * 5) + (incorrectAnswers * 1);
    
    // Send tokens using the wallet address if provided, otherwise use telegramId
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