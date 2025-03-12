// routes/admin.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Admin = require('../models/Admin');

// Секретный ключ для JWT (лучше хранить в .env)
const JWT_SECRET = process.env.JWT_SECRET || 'SUPER_SECRET_KEY';

/**
 * POST /api/admin/register
 * Создаёт нового админа (учётную запись).
 * Пример тела запроса: { "username": "admin", "password": "12345" }
 */
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Проверяем, нет ли такого пользователя
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(409).json({ message: 'Admin with this username already exists' });
    }

    // Хэшируем пароль
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Создаём запись админа
    const newAdmin = new Admin({
      username,
      passwordHash
    });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin created successfully', admin: { username: newAdmin.username } });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * POST /api/admin/login
 * Авторизация админа.
 * Пример тела запроса: { "username": "admin", "password": "12345" }
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Ищем админа по username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Проверяем пароль
    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Генерируем JWT
    const token = jwt.sign(
      { adminId: admin._id, username: admin.username },
      JWT_SECRET,
      { expiresIn: '1d' } // токен действительно 1 день
    );

    res.json({
      message: 'Login successful',
      token,
      admin: {
        username: admin.username
      }
    });
  } catch (error) {
    console.error('Error logging in admin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
