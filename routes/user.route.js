const express = require('express');
const router = express.Router();
const User = require('./models/user.model.js');
const { createUser, loginUser, verifyUser} = require('../controllers/user.controller.js');
const authenticate = require('./middlewares/authentication.js');
const {sendVerificationEmail} = require('./middlewares/nodemailer.js');
const Wallet = require('./models/wallet.model.js')



router.post('/register', createUser);
router.get('/verify-email/:token', verifyUser);
router.post('/login', loginUser);

module.export = router;