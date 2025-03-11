// routes/api.js
const express = require('express');
const WebAppData = require('../models/WebAppData');
const quizRoutes = require('./quiz');
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

module.exports = router;