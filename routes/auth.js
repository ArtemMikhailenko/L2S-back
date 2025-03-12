// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/auth', async (req, res) => {
  try {
    const { walletAddress, telegramId, telegramName, referrerCode } = req.body;
    
    console.log('Auth request received:', { walletAddress, telegramId, telegramName, referrerCode });
    
    if (!walletAddress || !telegramId || !telegramName) {
      return res.status(400).json({ message: 'Required data is missing' });
    }
    
    // Найти реферера по referralCode
    let referrerUser = null;
    if (referrerCode) {
      referrerUser = await User.findOne({ referralCode: referrerCode });
      console.log('Referrer lookup result:', referrerUser ? 'Found' : 'Not found');
    }
    
    // Проверяем, существует ли уже пользователь с данным кошельком
    let user = await User.findOne({ walletAddress });
    
    if (user) {
      // Обновляем данные существующего пользователя
      user.telegramId = telegramId;
      user.telegramName = telegramName;
      await user.save();
      
      return res.json({
        message: 'User logged in successfully',
        user,
      });
    }
    
    // Регистрируем нового пользователя
    user = new User({
      walletAddress,
      telegramId,
      telegramName,
      referrer: referrerUser ? referrerUser._id : null,
      level: 1,
      referralsCount: 0,
      referralPoints: 0,
    });
    await user.save();
    
    // Если есть реферер, обновляем его статистику
    if (referrerUser) {
      referrerUser.referralsCount = (referrerUser.referralsCount || 0) + 1;
      referrerUser.referralPoints = (referrerUser.referralPoints || 0) + 100;
      await referrerUser.save();
      console.log('Updated referrer stats:', { 
        referralsCount: referrerUser.referralsCount, 
        referralPoints: referrerUser.referralPoints 
      });
    }
    
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
