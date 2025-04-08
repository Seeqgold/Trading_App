const express = require('express');
const router = express.Router();
const { getTransactionHistory } = require('../controllers/transaction.controller'); 

router.get('/api/wallet/:userId/transactions', getTransactionHistory);

module.exports = router;
