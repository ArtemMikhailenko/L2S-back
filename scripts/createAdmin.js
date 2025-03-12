// scripts/createAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

// Проверьте, что переменная окружения MONGODB_URI указана
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables.');
  process.exit(1);
}

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('Connected to MongoDB.');

    // Задайте данные нового администратора
    const username = process.argv[2] || 'admin';
    const password = process.argv[3] || '12345';

    // Проверяем, существует ли админ с таким именем
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      console.error(`Admin with username "${username}" already exists.`);
      process.exit(1);
    }

    // Хэширование пароля
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      username,
      passwordHash,
    });

    await newAdmin.save();
    console.log(`Admin "${username}" created successfully.`);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });
