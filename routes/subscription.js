const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/pay-subscription', async (req, res) => {
  try {
    const { telegramId } = req.body;
    if (!telegramId) {
      return res.status(400).json({ message: 'telegramId is required' });
    }

    const user = await User.findOne({ telegramId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Option 1: Grant permanent access by setting a far-future date
    user.accessUntil = new Date('2099-01-01T00:00:00Z');

    // Option 2: Grant access for a fixed subscription period (e.g., 1 month)
    // const subscriptionDuration = Number(process.env.SUBSCRIPTION_DURATION) || 30 * 24 * 60 * 60 * 1000; // 30 days in ms
    // user.accessUntil = new Date(Date.now() + subscriptionDuration);

    await user.save();

    return res.json({ message: 'Subscription activated successfully', user });
  } catch (error) {
    console.error('Error activating subscription:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
