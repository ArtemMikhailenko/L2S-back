// routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 1) GET /api/user - Получение списка всех пользователей
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 2) GET /api/user/telegram/:telegramId - Получение пользователя по Telegram ID
router.get('/telegram/:telegramId', async (req, res) => {
  try {
    const telegramId = req.params.telegramId;
    const user = await User.findOne({ telegramId }).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error retrieving user by telegram id:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 3) GET /api/user/:id - Получение данных пользователя по его MongoDB ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
