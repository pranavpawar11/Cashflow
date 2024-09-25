const mongoose = require('mongoose');
const { Schema } = mongoose;

const TransactionSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  type: {
    type: String,
    enum: ['Income', 'Expense'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now(),
    required: true
  },
  description: {
    type: String
  },
  currency: {
    type: String,
    default: 'INR'
  },
  tag: {
    type: String,
    default: 'General'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Transaction = mongoose.model('transaction', TransactionSchema);
module.exports = Transaction;
