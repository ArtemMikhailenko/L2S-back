// routes/payment.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Config = require('../models/Config');

router.post('/extend-access', async (req, res) => {
  try {
    const { telegramId } = req.body;
    if (!telegramId) {
      return res.status(400).json({ message: 'telegramId is required' });
    }

    const user = await User.findOne({ telegramId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Получаем настройки из базы
    let config = await Config.findOne();
    if (!config) {
      // Если настроек нет, создаём новый документ с дефолтными значениями
      config = await Config.create({});
    }

    // Используем значение extensionDuration из настроек
    const extensionDuration = config.extensionDuration;
    const now = new Date();
    // Если время доступа уже истекло, базируемся на текущем времени
    const baseTime = user.accessUntil && user.accessUntil > now ? user.accessUntil : now;
    user.accessUntil = new Date(baseTime.getTime() + extensionDuration);

    await user.save();

    return res.json({ message: 'Access extended', accessUntil: user.accessUntil });
  } catch (error) {
    console.error('Error extending access:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
