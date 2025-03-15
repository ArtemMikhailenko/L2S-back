// models/Config.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const configSchema = new Schema({
  extensionDuration: { type: Number, default: 30 * 24 * 60 * 60 * 1000 }, // e.g., 30 days in ms
  paymentReceiver: { type: String, default: "UQAXd3nFwaf-bdh10cvEOp5XSk41HF50kyvBPo5M509z3Z1E" },
  paymentAmount: { type: Number, default: 50000000 }, // 0.05 TON in nanotons
  freeTrialDuration: { type: Number, default: 300000 } // 5 minutes in ms
});

module.exports = mongoose.model('Config', configSchema);
