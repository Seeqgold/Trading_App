const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['fund', 'transfer_out', 'transfer_in'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // in case of transfers
  },

}, { timestamps: true });
Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
