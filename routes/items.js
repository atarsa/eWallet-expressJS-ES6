const router = require('express').Router();
const verify = require('./verifyToken');
const Wallet = require('../model/Wallet');

// Get all items from wallet
router.get('/', verify, (req, res) => {
  
  Wallet.findById(req.wallet._id).then( (wallet) => {
    
    res.json(wallet.items);
  });
  
  //* here, we added verify middleware, so only logged users can see posts
  // *when checking who is logged in don't forget to do it asynchronichly!!!
});

// Add item to wallet
router.post('/', verify, (req, res) => {
  const item = {
    id: req.body.id,
    currency: req.body.currency,
    amount: req.body.amount
  };
  console.log('req.wallet._id: ', req.wallet._id);
  // TODO: respone back; 
  Wallet.findByIdAndUpdate(req.wallet._id, {$push: { items : item}}, {safe: true, new : true}, (err, wallet) => {
    
      // Handle any possible database errors
      if (err) {
        console.log(err)
        return res.status(500).send(err)};
      return res.send(wallet.items);
    })

});

 // TODO: response back; 
// Delete item from wallet
router.delete('/:id', verify, (req, res) =>{
  Wallet.findByIdAndUpdate(req.wallet._id,
     {$pull: { "items" : {"id": req.params.id}}}, 
     {safe: true, new: true}, 
     (err, wallet) => {
        // Handle any possible database errors
        if (err) {
          console.log(err)
          return res.status(500).send(err)};
        console.log(req.params.id);
        return res.send(wallet.items);
     })
});

// *For now PUT method by id, should be changed to currency as suposed to be unique??
// Update amount of item in wallet
router.put('/:id', verify, (req, res) =>{

  Wallet.findOneAndUpdate(
    {
      _id: req.wallet._id,
      "items.id": 
        req.params.id
    },
    {$set: { "items.$.amount" : req.body.amount}}, 
    
    {safe: true, new : true}, 
    (err, wallet) => {
    // Handle any possible database errors
      if (err) {
        console.log(err)
        return res.status(500).send(err)};
      
      return res.send(wallet.items);
    })
});

module.exports = router;