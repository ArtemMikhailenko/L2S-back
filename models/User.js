const mongoose = require('mongoose');
const crypto = require('crypto');

const freeTrialDuration = Number(process.env.FREE_TRIAL_DURATION) || 300000; // default 5 minutes

const userSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  telegramId: { type: Number, required: true },
  telegramName: { type: String, required: true },
  referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  referralsCount: { type: Number, default: 0 },
  referralPoints: { type: Number, default: 0 },
  referralCode: { type: String, unique: true },
  level: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  
  totalPoints: { type: Number, default: 0 },
  weeklyPoints: { type: Number, default: 0 },
  accessUntil: { type: Date, default: () => new Date(Date.now() + freeTrialDuration) },
});

userSchema.pre('save', function (next) {
  if (!this.referralCode) {
    const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();
    this.referralCode = randomPart;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
