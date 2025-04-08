const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require("dotenv").config();
const Wallet = require('./models/wallet.model.js');


const createUser = async (req,res) =>{
  try {
    const {username, email, password, role} = req.body;
    if(!username || !email || !password || !role){
     return res.status(400).json({message: 'All fields are required'})
    }
    const existingUser = await User.findOne({ $or: [ {email}, {username} ] });
    if(existingUser){
      return res.status(409).json({message: 'user already exist'})
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createUser = await User.create({
      email,
      username,
      password: hashedPassword,
      role: role || 'user',
      isVerified: false
    });

    const createWallet = await Wallet.create({
        userId: createUser._id,
        currency: 'NGN',   
        balance: 0,       
      });

    const token = jwt.sign(
        {
          id: createUser._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY_TIME }
      );
      await sendVerificationEmail(createUser, token);

    res.status(201).json({message: 'User created successfully',  user: {
        id: createUser._id,
        email: createUser.email,
        username: createUser.username,
        role: createUser.role
      }});

  } catch (error) {
    res.status(500).json({message: 'Internal server error'})
  }
};

const verifyUser = async (req, res) => {
    try {
      const { token } = req.params;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
     
      const existingUser = await User.findById(decoded.id);
  
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (existingUser.isVerified) {
        return res.status(400).json({ message: 'User already verified' });
      }
  
      existingUser.isVerified = true;
      await existingUser.save();
  
      res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
    } catch (error) {
      res.status(400).json({ message: 'Invalid token', error: error.message });
    }
  };


  const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email }).select('+password');
      
      if (!existingUser) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }
  
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }  
  
      if (!existingUser.isVerified)
          return res.status(403).json({ message: 'Please verify your email before logging in' });
  
      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: 'Internal error' });
      }
  
      const token = jwt.sign(
        {
          email: existingUser.email,
          role: existingUser.role,
          id: existingUser._id,
          username: existingUser.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY_TIME }
      );
  
      res.status(200).json({ token });
  
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  };

  module.exports = {createUser, loginUser, verifyUser};
  
