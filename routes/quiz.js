const express = require('express');
const QuizQuestion = require('../models/QuizQuestion');
const router = express.Router();
const { sendTokensToWallet } = require('../utils/tonTransactions');

router.post('/questions', async (req, res) => {
    try {
      const { question, correctAnswer, wrongAnswers } = req.body;
  
      if (!question || !correctAnswer || !wrongAnswers) {
        return res.status(400).json({ message: 'question, correctAnswer, and wrongAnswers are required' });
      }
  
      // Проверяем, что wrongAnswers - это массив из трёх строк
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
  
  // 2) Получить все вопросы
  // GET /api/questions
  router.get('/questions', async (req, res) => {
    try {
      const questions = await QuizQuestion.find();
      return res.json(questions);
    } catch (error) {
      console.error('Error retrieving questions:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  
  // 3) Получить вопрос по ID
  // GET /api/questions/:id
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
  
  // 4) Редактировать вопрос
  // PUT /api/questions/:id
  router.put('/questions/:id', async (req, res) => {
    try {
      const { question, correctAnswer, wrongAnswers } = req.body;
  
      // Находим вопрос по ID
      const existingQuestion = await QuizQuestion.findById(req.params.id);
      if (!existingQuestion) {
        return res.status(404).json({ message: 'Question not found' });
      }
  
      // Обновляем поля, если они переданы
      if (question !== undefined) existingQuestion.question = question;
      if (correctAnswer !== undefined) existingQuestion.correctAnswer = correctAnswer;
      if (wrongAnswers !== undefined) {
        // Доп. проверка на формат
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
  router.post('/sendTokens', async (req, res) => {
    try {
      const { walletAddress, amount } = req.body;
      if (!walletAddress || !amount) {
        return res.status(400).json({ message: 'walletAddress and amount are required' });
      }
      // Функция sendTokensToWallet должна отправлять транзакцию в TON-сеть,
      // используя ваш кошелек-отправитель и приватный ключ (будьте осторожны с безопасностью!)
      const txResult = await sendTokensToWallet(walletAddress, amount);
      res.json({ message: 'Tokens sent successfully', txResult });
    } catch (error) {
      console.error('Error sending tokens:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  
module.exports = router;
