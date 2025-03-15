// models/Config.js
const mongoose = require('mongoose');
const { Schema } = mongoose; // Destructure Schema from mongoose

const configSchema = new Schema({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true }
});

module.exports = mongoose.model('Config', configSchema);
