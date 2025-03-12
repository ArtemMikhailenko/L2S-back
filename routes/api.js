// routes/api.js
const express = require('express');
const WebAppData = require('../models/WebAppData');
const quizRoutes = require('./quiz');
const adminRoutes = require('./admin');  // <-- импорт admin.js
const authRoutes = require('./auth');
const userRoutes = require('./user');

const router = express.Router();

// API endpoint to get all data from MongoDB
router.get('/webapp-data', async (req, res) => {
  try {
    const data = await WebAppData.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving data', error: error.message });
  }
});


router.use('/quiz', quizRoutes);
router.use('/admin', adminRoutes);
router.use('/', authRoutes);
router.use('/user', userRoutes);

module.exports = router;