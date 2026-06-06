const mongoose = require('mongoose');

const workerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  categories: [{
    type: String,
    trim: true
  }],
  priceList: [{
    service: { type: String, trim: true },
    price: { type: String, trim: true }
  }],
  portfolio: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['Озод', 'Банд'],
    default: 'Озод'
  },
  rating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  bio: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('WorkerProfile', workerProfileSchema);