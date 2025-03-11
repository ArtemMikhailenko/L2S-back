require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Импортируем пакет cors
const mongoose = require('mongoose');
const TelegramBot = require('node-telegram-bot-api');
const apiRoutes = require('./routes/api');

// Переменные окружения
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const BOT_TOKEN = process.env.BOT_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL;

if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN не задан в переменных окружения');
}

// Подключение к MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Подключение к MongoDB успешно'))
  .catch((err) => console.error('Ошибка подключения к MongoDB:', err));

// Создаем Telegram бота с polling (для разработки, в продакшене лучше использовать webhook)
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Обработка команды /start
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

// Обработка данных из веб-приложения
bot.on('web_app_data', async (msg) => {
  const chatId = msg.chat.id;
  try {
    const data = JSON.parse(msg.web_app_data.data);
    console.log('Получены данные:', data);

    // Импортируем модель внутри обработчика, чтобы избежать циклических зависимостей
    const WebAppData = require('./models/WebAppData');
    const webAppData = new WebAppData({ chatId, data });
    await webAppData.save();

    bot.sendMessage(chatId, `Получены данные и сохранены: ${JSON.stringify(data)}`);
  } catch (error) {
    console.error('Ошибка при обработке web_app_data:', error);
    bot.sendMessage(chatId, 'Произошла ошибка при обработке данных.');
  }
});

// Обработка ошибок polling
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

// Создаем Express сервер
const app = express();

// Включаем CORS для всех запросов
app.use(cors());

// Middleware для парсинга JSON в теле запросов
app.use(express.json());

// Роуты API
app.use('/api', apiRoutes);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
