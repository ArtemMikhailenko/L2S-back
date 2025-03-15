// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const RewardSettings = require('../models/RewardSettings');

router.post('/auth', async (req, res) => {
  try {
    const { walletAddress, telegramId, telegramName, referrerCode } = req.body;
    
    console.log('Auth request received:', { walletAddress, telegramId, telegramName, referrerCode });
    
    if (!walletAddress || !telegramId || !telegramName) {
      return res.status(400).json({ message: 'Required data is missing' });
    }
    
    let referrerUser = null;
    if (referrerCode) {
      referrerUser = await User.findOne({ referralCode: referrerCode });
      console.log('Referrer lookup result:', referrerUser ? 'Found' : 'Not found');
    }
    
    // Retrieve reward settings from DB
    const rewardSettings = await RewardSettings.findOne();

    let user = await User.findOne({ telegramId });
    
    if (user) {
      user.telegramId = telegramId;
      user.telegramName = telegramName;
      await user.save();
      
      return res.json({
        message: 'User logged in successfully',
        user,
      });
    }
    
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
    
    if (referrerUser) {
      // Update direct referrer stats using primaryReferralPoints from reward settings (fallback to 100 if not available)
      referrerUser.referralsCount = (referrerUser.referralsCount || 0) + 1;
      referrerUser.referralPoints = (referrerUser.referralPoints || 0) + (rewardSettings?.primaryReferralPoints || 100);
      await referrerUser.save();
      
      // Update indirect referrer if exists using secondaryReferralPoints (fallback to 50)
      if (referrerUser.referrer) {
        const indirectReferrer = await User.findById(referrerUser.referrer);
        if (indirectReferrer) {
          indirectReferrer.referralPoints = (indirectReferrer.referralPoints || 0) + (rewardSettings?.secondaryReferralPoints || 50);
          await indirectReferrer.save();
          console.log('Updated indirect referrer stats:', { 
            telegramName: indirectReferrer.telegramName, 
            referralPoints: indirectReferrer.referralPoints 
          });
        }
      }
      
      console.log('Updated direct referrer stats:', { 
        telegramName: referrerUser.telegramName, 
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
