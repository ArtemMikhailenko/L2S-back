// createRewardSettings.js
const mongoose = require('mongoose');
const RewardSettings = require('../models/RewardSettings'); // adjust the path if needed
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yourdbname';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('Connected to MongoDB');

    // Check if reward settings already exist
    const existingSettings = await RewardSettings.findOne();
    if (existingSettings) {
      console.log('Reward settings already exist:', existingSettings);
    } else {
      const settings = new RewardSettings({
        primaryReferralPoints: 100,
        secondaryReferralPoints: 50,
        correctAnswerTokens: 5,
        incorrectAnswerTokens: 1,
        correctAnswerPoints: 10,
        incorrectAnswerPoints: 2,
        weeklyRewardTokens: 10,
      });
      
      await settings.save();
      console.log('Base reward settings created:', settings);
    }
    mongoose.disconnect();
    process.exit(0);
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });
