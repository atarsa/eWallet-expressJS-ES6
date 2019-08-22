const router = require('express').Router();
const verify = require('./verifyToken');
const Wallet = require('../model/Wallet');
const {itemValidation} = require('../validation');
const {amountValidation} = require('../validation');

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
  // Validate the data before creating an item
  const {error} = itemValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const item = {
    id: req.body.id,
    currency: req.body.currency,
    amount: req.body.amount
  };
 
  Wallet.findByIdAndUpdate(req.wallet._id, {$push: { items : item}}, {safe: true, new : true}, (err, wallet) => {
    
      // Handle any possible database errors
      if (err) {
        console.log(err)
        return res.status(500).send(err)};
      return res.send(wallet.items);
    })

});


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

// *For now PUT method by id, should be changed to currency as supposed to be unique anyway??

// Update amount of item in wallet
router.put('/:id', verify, (req, res) =>{

   // Validate the data before updating an item
   const {error} = amountValidation(req.body);

   if (error) return res.status(400).send(error.details[0].message);

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