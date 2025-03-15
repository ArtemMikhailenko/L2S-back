const express = require('express');
const router = express.Router();
const RewardSettings = require('../models/RewardSettings');

// GET /api/reward-settings
// Retrieve the current reward settings
router.get('/', async (req, res) => {
  try {
    const settings = await RewardSettings.findOne();
    if (!settings) {
      return res.status(404).json({ message: 'Reward settings not found' });
    }
    res.json(settings);
  } catch (error) {
    console.error('Error retrieving reward settings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/reward-settings
// Create reward settings if none exist (only one settings document should exist)
router.post('/', async (req, res) => {
  try {
    // Check if settings already exist
    const existing = await RewardSettings.findOne();
    if (existing) {
      return res.status(400).json({ message: 'Reward settings already exist' });
    }

    const {
      primaryReferralPoints,
      secondaryReferralPoints,
      correctAnswerTokens,
      incorrectAnswerTokens,
      correctAnswerPoints,
      incorrectAnswerPoints,
      weeklyRewardTokens
    } = req.body;

    const settings = new RewardSettings({
      primaryReferralPoints,
      secondaryReferralPoints,
      correctAnswerTokens,
      incorrectAnswerTokens,
      correctAnswerPoints,
      incorrectAnswerPoints,
      weeklyRewardTokens
    });

    await settings.save();
    res.status(201).json({ message: 'Reward settings created successfully', settings });
  } catch (error) {
    console.error('Error creating reward settings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/reward-settings
// Update the current reward settings
router.put('/', async (req, res) => {
  try {
    const {
      primaryReferralPoints,
      secondaryReferralPoints,
      correctAnswerTokens,
      incorrectAnswerTokens,
      correctAnswerPoints,
      incorrectAnswerPoints,
      weeklyRewardTokens
    } = req.body;

    const settings = await RewardSettings.findOne();
    if (!settings) {
      return res.status(404).json({ message: 'Reward settings not found' });
    }

    if (primaryReferralPoints !== undefined) settings.primaryReferralPoints = primaryReferralPoints;
    if (secondaryReferralPoints !== undefined) settings.secondaryReferralPoints = secondaryReferralPoints;
    if (correctAnswerTokens !== undefined) settings.correctAnswerTokens = correctAnswerTokens;
    if (incorrectAnswerTokens !== undefined) settings.incorrectAnswerTokens = incorrectAnswerTokens;
    if (correctAnswerPoints !== undefined) settings.correctAnswerPoints = correctAnswerPoints;
    if (incorrectAnswerPoints !== undefined) settings.incorrectAnswerPoints = incorrectAnswerPoints;
    if (weeklyRewardTokens !== undefined) settings.weeklyRewardTokens = weeklyRewardTokens;

    await settings.save();
    res.json({ message: 'Reward settings updated successfully', settings });
  } catch (error) {
    console.error('Error updating reward settings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
