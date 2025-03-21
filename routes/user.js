// routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

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
router.post('/add-points', async (req, res) => {
    try {
      const { telegramId, points } = req.body;
      if (!telegramId || typeof points !== 'number') {
        return res.status(400).json({ message: 'telegramId and points are required' });
      }
      const user = await User.findOne({ telegramId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      user.totalPoints = (user.totalPoints || 0) + points;
      user.weeklyPoints = (user.weeklyPoints || 0) + points;
      await user.save();
      
      return res.json({
        message: `Added ${points} points to user ${telegramId}`,
        totalPoints: user.totalPoints,
        weeklyPoints: user.weeklyPoints,
      });
    } catch (error) {
      console.error('Error adding points:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
module.exports = router;
