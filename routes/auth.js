// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/auth', async (req, res) => {
    try {
      const { walletAddress, telegramId, telegramName } = req.body;
      
      console.log('Auth request received:', { walletAddress, telegramId, telegramName });
      
      if (!walletAddress || !telegramId || !telegramName) {
        return res.status(400).json({ message: 'Required data is missing' });
      }
      
      // Check if user with this wallet exists
      let user = await User.findOne({ walletAddress });
      
      if (user) {
        // If the user already exists, "login" and update Telegram data if necessary
        user.telegramId = telegramId;
        user.telegramName = telegramName;
        await user.save();
        
        return res.json({
          message: 'User logged in successfully',
          user,
        });
      }
      
      // If not - create a new one (registration)
      user = new User({
        walletAddress,
        telegramId,
        telegramName,
      });
      await user.save();
      
      return res.json({
        message: 'User registered successfully',
        user,
      });
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

module.exports = router;
