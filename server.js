const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Import routes
const authRoute = require('./routes/auth');
const itemRoute = require('./routes/items');
const baseCurrencyRoute = require('./routes/baseCurrency');
const ratesRoute = require('./routes/rates');

dotenv.config();

// Connect to DB
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.DB_CONNECT_TEST, { useNewUrlParser: true }, () => console.log("Connected to DB")); 


// Initialize app
const app = express();

// Middleware
app.use(express.json());

// Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/items', itemRoute);
app.use('/api/base', baseCurrencyRoute);
app.use('/api/rates', ratesRoute);


module.exports = app;
