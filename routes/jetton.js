// routes/jetton.js
const express = require('express');
const router = express.Router();
const jettonService = require('../utils/tonTransactions');

router.post('/transfer', async (req, res) => {
    try {
        const { amount, address } = req.body;
        
        if (!amount || !address) {
          return res.status(400).json({ success: false, message: 'Amount and address are required' });
        }
        
        const result = await jettonService.transferJettons(Number(amount), address);
        return res.json(result);
      } catch (error) {
        console.error('Transfer error:', error);
        return res.status(500).json({ success: false, message: error.message });
      }
});

module.exports = router;
