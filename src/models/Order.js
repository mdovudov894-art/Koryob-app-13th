const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  deadline: {
    type: String,
    required: true
  },
  budget: {
    type: String,
    default: 'Музокира карда мешавад'
  },
  images: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['Актив', 'Иҷрошуда', 'Пӯшида'],
    default: 'Актив'
  },
  assignedWorker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  responses: [{
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    price: { type: String },
    deadline: { type: String },
    message: { type: String },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);