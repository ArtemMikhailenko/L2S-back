// models/User.js
const mongoose = require('mongoose');
const crypto = require('crypto');

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
});

// Генерация referralCode перед сохранением нового пользователя
userSchema.pre('save', function (next) {
  if (!this.referralCode) {
    // Генерируем 4 байта (8 символов hex), затем приводим к верхнему регистру
    const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();
    // Пример результата: "A3B9F1C2"
    this.referralCode = randomPart;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
