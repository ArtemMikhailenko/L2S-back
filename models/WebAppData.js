// models/WebAppData.js
const mongoose = require('mongoose');

const webAppDataSchema = new mongoose.Schema({
  chatId: { type: Number, required: true },
  data: { type: Object, required: true },
  receivedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WebAppData', webAppDataSchema);
