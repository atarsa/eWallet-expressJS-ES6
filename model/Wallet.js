const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// List of available currencies
/* list compatible with https://exchangeratesapi.io/ and foreign exchange rates published by the European Central Bank https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html */
const availableCurrencies = ['EUR', 'USD', 'JPY','BGN','CZK', 'DKK','GBP','HUF' ,'PLN' ,'RON', 'SEK' ,'CHF' ,'ISK' ,'NOK' ,'HRK' ,'RUB' ,'TRY' ,'AUD' ,'BRL','CAD','CNY','HKD' ,'IDR','ILS' ,'INR','KRW','MXN','MYR','NZD','PHP','SGD','THB','ZAR'];


// Create wallet schema
const walletSchema = new Schema({
  username: {
    type: String,
    required: true,
    min: 5,
    max: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024
  },
  baseCurrency: {
    type: String,
    minlength: 3,
    maxlength: 3,
    default: 'GBP',
    uppercase: true,
    trim: true
  },
  items: [{
    id: {
      type: Number,
      min: 0      
    },
    currency: {
      type: String,
      minlength: 3,
      maxlength: 3,
      uppercase: true,
      enum: availableCurrencies,
      
    },
    amount: {
      type: Number,
      min: 0
    }
  }]
});

module.exports = mongoose.model('Wallet', walletSchema);