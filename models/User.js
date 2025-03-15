const mongoose = require('mongoose');
const crypto = require('crypto');
const Config = require('./Config'); // убедитесь, что путь корректный

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
  accessUntil: { type: Date } // будем устанавливать в pre('save')
});

// Асинхронный pre-save хук
userSchema.pre('save', async function (next) {
  // Генерация referralCode, если отсутствует
  if (!this.referralCode) {
    const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();
    this.referralCode = randomPart;
  }
  if (this.isNew && !this.accessUntil) {
    try {
      const config = await Config.findOne();
      const freeTrialDuration =
        config && config.freeTrialDuration ? config.freeTrialDuration : 300000;
      this.accessUntil = new Date(Date.now() + freeTrialDuration);
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
