// routes/config.js
const express = require('express');
const router = express.Router();
const Config = require('../models/Config');

// GET /api/config/settings
// Retrieve the current configuration settings
router.get('/settings', async (req, res) => {
  try {
    let config = await Config.findOne();
    // If no config exists, create one with default values
    if (!config) {
      config = await Config.create({});
    }
    return res.json(config);
  } catch (error) {
    console.error('Error fetching config settings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/config/settings
// Update the configuration settings (admin-only in production)
router.put('/settings', async (req, res) => {
  try {
    const { extensionDuration, paymentReceiver, paymentAmount, freeTrialDuration } = req.body;
    
    // Optional: validate input values
    if (extensionDuration !== undefined && (isNaN(extensionDuration) || extensionDuration <= 0)) {
      return res.status(400).json({ message: 'Invalid extensionDuration value' });
    }
    if (paymentAmount !== undefined && (isNaN(paymentAmount) || paymentAmount <= 0)) {
      return res.status(400).json({ message: 'Invalid paymentAmount value' });
    }
    if (freeTrialDuration !== undefined && (isNaN(freeTrialDuration) || freeTrialDuration <= 0)) {
      return res.status(400).json({ message: 'Invalid freeTrialDuration value' });
    }

    let config = await Config.findOne();
    if (!config) {
      config = new Config();
    }
    
    if (extensionDuration !== undefined) config.extensionDuration = extensionDuration;
    if (paymentReceiver !== undefined) config.paymentReceiver = paymentReceiver;
    if (paymentAmount !== undefined) config.paymentAmount = paymentAmount;
    if (freeTrialDuration !== undefined) config.freeTrialDuration = freeTrialDuration;
    
    await config.save();
    return res.json({ message: 'Config updated successfully', config });
  } catch (error) {
    console.error('Error updating config settings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
