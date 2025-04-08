const Wallet = require('../models/wallet.model');
const router = express.Router();
const express = require('express');
const {fundWallet, transferFunds,getWalletBalance } = require('../controllers/wallet.controller');
router.post('/fundWallet', fundWallet);
router.post('/transfer', transferFunds);
router.get('/:id', getWalletBalance);

module.exports = router;