const Wallet = require('../models/wallet.model');
const User = require('../models/user.model');
const Transaction = require('../models/transaction.model.js');


const fundWallet = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    const fundAmount = Number(amount);
    if (!userId || isNaN(fundAmount) || fundAmount <= 0) {
      return res.status(400).json({ message: 'Invalid user ID or amount' });
    }

    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    wallet.balance += fundAmount;
    const updatedWallet = await wallet.save();

    await Transaction.create({
      userId: userId,
      type: 'fund',
      amount: fundAmount,
      timestamp: new Date(),
    });

    res.status(200).json({
      message: 'Wallet funded successfully.',
      balance: updatedWallet.balance,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


const transferFunds = async (req, res) => {
  try {
    const { senderId, receiverId, amount } = req.body;
    const transferAmount = Number(amount);

    if (!senderId || !receiverId || isNaN(transferAmount) || transferAmount <= 0) {
      return res.status(400).json({ message: 'Invalid sender, receiver, or amount' });
    }

    if (senderId === receiverId) {
      return res.status(400).json({ message: 'Sender and receiver cannot be the same' });
    }

    const senderWallet = await Wallet.findOne({ userId: senderId });
    const receiverWallet = await Wallet.findOne({ userId: receiverId });

    if (!senderWallet || !receiverWallet) {
      return res.status(404).json({ message: 'Sender or receiver wallet not found' });
    }

    if (senderWallet.balance < transferAmount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    senderWallet.balance -= transferAmount;
    receiverWallet.balance += transferAmount;

    await senderWallet.save();
    await receiverWallet.save();

    await Transaction.create({
      userId: senderId,
      type: 'transfer_out',
      amount: transferAmount,
      to: receiverId, // adding receiver information
      timestamp: new Date(),
    });

    await Transaction.create({
      userId: receiverId,
      type: 'transfer_in',
      amount: transferAmount,
      from: senderId, // adding sender information
      timestamp: new Date(),
    });

    res.status(200).json({
      message: 'Transfer successful',
      senderBalance: senderWallet.balance,
      receiverBalance: receiverWallet.balance,
    });

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const getWalletBalance = async (req, res) => {
  try {
    const { id } = req.params;  
    
    const wallet = await Wallet.findById(id);

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    res.status(200).json({
      balance: wallet.balance,
      currency: wallet.currency,
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

module.exports = {fundWallet, transferFunds, getWalletBalance};