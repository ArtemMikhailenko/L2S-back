require('dotenv').config();
const cron = require('node-cron');
const express = require('express');
const cors = require('cors'); 
const mongoose = require('mongoose');
const jettonService = require('./utils/tonTransactions');
const TelegramBot = require('node-telegram-bot-api');
const apiRoutes = require('./routes/api');
const User = require('./models/User');
const RewardSettings = require('./models/RewardSettings'); // Import the reward settings model

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const BOT_TOKEN = process.env.BOT_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL;

cron.schedule('0 0 * * 0', async () => {
  try {
    // Retrieve the reward settings from the database.
    const rewardSettings = await RewardSettings.findOne();
    // Use the weeklyRewardTokens value, defaulting to 10 if not found.
    const weeklyRewardTokens = rewardSettings ? rewardSettings.weeklyRewardTokens : 10;
    
    const topUser = await User.findOne().sort({ weeklyPoints: -1 }).exec();
  
    if (topUser && topUser.walletAddress) {
      console.log(`Sending ${weeklyRewardTokens} tokens to the top user: ${topUser.telegramName} (wallet: ${topUser.walletAddress})`);
      const txResult = await jettonService.transferJettons(weeklyRewardTokens, topUser.walletAddress);
      console.log('Token transfer result:', txResult);
    } else {
      console.log('No top user found or top user has no walletAddress');
    }
    
    // Reset weekly points for all users
    await User.updateMany({}, { $set: { weeklyPoints: 0 } });
    console.log('Weekly points reset done.');
  } catch (error) {
    console.error('Error in weekly cron job:', error);
  }
});

if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN не задан в переменных окружения');
}

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Подключение к MongoDB успешно'))
  .catch((err) => console.error('Ошибка подключения к MongoDB:', err));

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Добро пожаловать! Нажмите кнопку ниже, чтобы открыть веб-приложение:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Открыть приложение', web_app: { url: WEB_APP_URL } }]
      ]
    }
  });
});

bot.on('web_app_data', async (msg) => {
  const chatId = msg.chat.id;
  try {
    const data = JSON.parse(msg.web_app_data.data);
    console.log('Получены данные:', data);

    const WebAppData = require('./models/WebAppData');
    const webAppData = new WebAppData({ chatId, data });
    await webAppData.save();

    bot.sendMessage(chatId, `Получены данные и сохранены: ${JSON.stringify(data)}`);
  } catch (error) {
    console.error('Ошибка при обработке web_app_data:', error);
    bot.sendMessage(chatId, 'Произошла ошибка при обработке данных.');
  }
});

bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
