const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  serialNumber: Number,
  productName: String,
  inputUrls: [String],
  outputUrls: [String],
  status: { type: String, default: 'processing' },
  requestId:mongoose.Types.ObjectId,
}, { timestamps: true });

module.exports = mongoose.model('Image', imageSchema);