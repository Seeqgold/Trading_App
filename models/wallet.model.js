const mongoose = require('mongoose');

const walletSchema = mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
    },
  currency: { 
    type: String,
    default: 'NGN' 
    },
  balance: { 
    type: Number, 
    default: 0 },
},
{timestamps:true}

);

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
