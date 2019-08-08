const router = require('express').Router();
const fetch = require('node-fetch');
const verify = require('./verifyToken');
const Wallet = require('../model/Wallet');
const {currencySymbolValidation} = require('../validation');

// get all latest currency exchange rates
router.get('/latest', verify, async (req, res) => {

  const wallet = await Wallet.findById(req.wallet._id, async(err, wallet) => {
    
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    } 
    
    return wallet;
  })
  
  // *get user's base currency
  const baseCurrency = wallet.baseCurrency;
  // *check if any parameters in body
  // *fetch latest rates from outside API
  let url;
  
   if ( req.query.symbols ) {
    // Add symbols from query url
    // Check if valid
    // Validate the data before updating an item
    const {error} = currencySymbolValidation(req.query);
    if (error) return res.status(400).send(error.details[0].message);

    url = `https://api.exchangeratesapi.io/latest?base=${baseCurrency}&symbols=${req.query.symbols.toUpperCase()}`;
  } else {
    
   url = `https://api.exchangeratesapi.io/latest?base=${baseCurrency}`;
  
  }
  
  const response = await fetch(url)
    .then(checkStatus)
    .then(res => res.json());
  
  return res.send(response);
});


// helper function
function checkStatus(res) {
  if (res.ok) { // res.status >= 200 && res.status < 300
    return res;
  } else {
    throw new Error(res.statusText);
  }   
}

module.exports = router;