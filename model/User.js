const mongoose = require('mongoose');


// List of available currencies
/* list compatible with https://exchangeratesapi.io/ and foreign exchange rates published by the European Central Bank https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html */
const availableCurrencies = ['EUR', 'USD', 'JPY','BGN','CZK',
'DKK','GBP','HUF' ,'PLN' ,'RON' ,'SEK' ,'CHF' ,'ISK' ,'NOK' ,'HRK' ,'RUB' ,'TRY' ,'AUD' ,'BRL','CAD','CNY','HKD' ,'IDR','ILS' ,'INR','KRW','MXN','MYR','NZD','PHP','SGD','THB','ZAR'];


// Create wallet schema
const WalletSchema = new mongoose.Schema({
  baseCurrency: {
    type: String,
    min: 3,
    max: 3,
    default: 'GBP',
    uppercase: true
  },
  items: {
    id: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      min: 3,
      max: 3,
      uppercase: true,
      enum: availableCurrencies
    },
    amount: {
      type: Number,
      min: 0
    }
  }

});

// Create user schema
const userSchema = new mongoose.Schema({
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
  // add wallet
  wallet: WalletSchema
});

module.exports = mongoose.model('User', userSchema);