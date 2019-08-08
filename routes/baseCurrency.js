const router = require('express').Router();
const verify = require('./verifyToken');
const Wallet = require('../model/Wallet');


// *GET base currency 
router.get('/', verify, (req, res) => {

  Wallet.findById(req.wallet._id, (err, wallet) => {

    if (err) {
      console.log(err)
      return res.status(500).send(err)
    };
    
    return res.send(wallet.baseCurrency);
  })
});


// *Update base currency
router.put('/', verify, (req, res) => {

  Wallet.findByIdAndUpdate(req.wallet._id, {baseCurrency: req.body.baseCurrency}, {safe: true, new: true}, (err, wallet) => {

    if (err) {
      console.log(err)
      return res.status(500).send(err)
    };
    
    return res.send(wallet.baseCurrency);
  })
});


module.exports = router;