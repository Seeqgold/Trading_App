const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const User = require('./models/user.model.js');
const Wallet = require('./models/wallet.model.js')
const userRoute = require('./routes/user.route.js');
const walletRoute = require('./controllers/wallet.controller.js');

const app = express();
app.use(express.json());

app.use('/api/user', userRoute);
app.use('/api/wallet', walletRoute);


app.listen(process.env.PORT, () => {
  console.log(`port is listening to ${process.env.PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello from node API");
});


mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log("DB not connected");
  });
