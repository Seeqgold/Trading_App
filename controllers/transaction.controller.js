const Wallet = require('../models/wallet.model.js');
const User = require('../models/user.model');
const Transaction = require('../models/transaction.model.js');  

const getTransactionHistory = async (req, res) => {
  try {
    const { userId } = req.params; 
    
    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    const transactions = await Transaction.find({ userId })
      .sort({ timestamp: -1 })  // Sort by timestamp, newest first
      .select('type amount to timestamp'); 

    if (transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found' });
    }

    res.status(200).json(transactions);

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

module.exports = { getTransactionHistory };
