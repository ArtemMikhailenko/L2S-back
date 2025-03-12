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
    
    // Find referrer by referralCode instead of telegramName
    let referrerUser = null;
    if (referrerCode) {
      referrerUser = await User.findOne({ referralCode: referrerCode });
      console.log('Referrer lookup result:', referrerUser ? 'Found' : 'Not found');
    }
    
    // Check if user already exists
    let user = await User.findOne({ walletAddress });
    
    if (user) {
      // Update existing user data
      user.telegramId = telegramId;
      user.telegramName = telegramName;
      await user.save();
      
      return res.json({
        message: 'User logged in successfully',
        user,
      });
    }
    
    // Register new user
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
    
    // Update referrer stats if applicable
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