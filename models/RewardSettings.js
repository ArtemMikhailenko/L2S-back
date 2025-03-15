const mongoose = require('mongoose');

const rewardSettingsSchema = new mongoose.Schema({
  primaryReferralPoints: { type: Number, default: 100 },
  secondaryReferralPoints: { type: Number, default: 50 },
  correctAnswerTokens: { type: Number, default: 5 },
  incorrectAnswerTokens: { type: Number, default: 1 },
  correctAnswerPoints: { type: Number, default: 10 },
  incorrectAnswerPoints: { type: Number, default: 2 },
  weeklyRewardTokens: { type: Number, default: 10 }
});

module.exports = mongoose.model('RewardSettings', rewardSettingsSchema);
