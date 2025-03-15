// routes/config.js
const express = require('express');
const router = express.Router();
const Config = require('../models/Config');

// Endpoint to update extension duration (in milliseconds)
// (Only an admin should be allowed to call this in production)
router.post('/extension-duration', async (req, res) => {
  try {
    const { extensionDuration } = req.body;
    if (!extensionDuration) {
      return res.status(400).json({ message: 'extensionDuration is required' });
    }
    const duration = Number(extensionDuration);
    if (isNaN(duration) || duration <= 0) {
      return res.status(400).json({ message: 'Invalid extensionDuration value' });
    }

    // Upsert config with key 'extensionDuration'
    const config = await Config.findOneAndUpdate(
      { key: 'extensionDuration' },
      { value: duration },
      { new: true, upsert: true }
    );

    return res.json({ message: 'Extension duration updated', config });
  } catch (error) {
    console.error('Error updating extension duration:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Endpoint to get current extension duration
router.get('/extension-duration', async (req, res) => {
  try {
    const config = await Config.findOne({ key: 'extensionDuration' });
    if (!config) {
      return res.status(404).json({ message: 'Extension duration not set' });
    }
    return res.json({ extensionDuration: config.value });
  } catch (error) {
    console.error('Error fetching extension duration:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
