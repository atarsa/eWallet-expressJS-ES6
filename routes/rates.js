const router = require('express').Router();
const fetch = require('node-fetch');
const verify = require('./verifyToken');
const Wallet = require('../model/Wallet');
const {currencySymbolValidation} = require('../validation');

// get latest currency exchange rates
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
    // get all currencies
   url = `https://api.exchangeratesapi.io/latest?base=${baseCurrency}`;
  
  }
  
  const response = await fetch(url)
    .then(checkStatus)
    .then(res => res.json());
  
  return res.send(response);
});

// "Exchange" money
router.post('/exchange',  async (req, res) => {

   try{
      // *get info from request body
      const baseCurrency = req.body.baseCurrency.trim().toUpperCase();
      const exchangeCurrency = req.body.exchangeCurrency.trim().toUpperCase();
      const amountToExchange = Number.parseInt(req.body.amount);
      let exchangedAmount = 0;
      
      const url = `https://api.exchangeratesapi.io/latest?base=${baseCurrency}&symbols=${exchangeCurrency}`;
      
      const response = await fetch(url)
        .then(checkStatus)
        .then(res => res.json());
        
      exchangedAmount = amountToExchange / Number.parseFloat(response.rates[exchangeCurrency])  ;
        
      return res.send({
        baseCurrency,
        exchangeCurrency,
        exchangedAmount
      });
   } catch(e){
      console.log(e);
      return res.status(404).send("Something went wrong. Check your request body.");
   } 
  
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