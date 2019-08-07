const router = require('express').Router();
const verify = require('./verifyToken');
const Wallet = require('../model/Wallet');

// Get all items from wallet
router.get('/', verify, (req, res) => {
  
  Wallet.findById(req.wallet._id).then( (wallet) => {
    
    res.json(wallet);
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
  Wallet.findByIdAndUpdate(req.wallet._id, {$push: { items : item}}, {safe: true, new : true}, (err, item) => {
    
      // Handle any possible database errors
      if (err) {
        console.log(err)
        return res.status(500).send(err)};
      return res.send(item);
    })

  // console.log(req.wallet._id)
  // Wallet.findById(req.wallet._id, (err, item) => {
  //   // Handle any possible database errors
  //   if (err) {
  //     console.log(err)
  //     return res.status(500).send(err)};
  //   return res.send(item);
  // })

});

 // TODO: respone back; 
// Delete item from wallet
router.delete('/:id', verify, (req, res) =>{
  Wallet.findByIdAndUpdate(req.user._id,
     {$pull: { "wallet.items" : {id: req.params.id}}}, 
     {safe: true, upsert: true, new : true}, 
     (err, user) => {
        // Handle any possible database errors
        if (err) {
          console.log(err)
          return res.status(500).send(err)};
        console.log(req.params.id);
        return res.send(user.wallet);
     })
});

 // !NOT WORKING; 
// Update amount of item in wallet
router.put('/items/:currency', verify, (req, res) =>{

  // db.SCSIssue.find(
  //   { _id: ObjectId("5439a2992ea8cc0f70feef2d") }, 
  //   { Statuses: { $elemMatch: { StatusID: { $gte : NumberLong(521055087020736513) } } } }
  //  )
  User.updateOne({
    _id: req.user._id , 
    "items": {$elemMatch : {currency: req.body.currency}}}
  ,
  {$set: { "items.$.amount" : req.body.amount}}
  
  ).then( (err, item) => {

    console.log(item);
    if (err){
        res.send(err)
    }    

    if (item) {
        console.log("Item Found");
        res.send(item);

    }
  }) 
  
      

  
  // User.update(
  //   {
    
  //   "wallet.items.currency": 
  //     req.body.currency 
  // },
  //   {
  //     $set: {"wallet.items.$.amount": req.body.amount}
  //   }
  // ).then(
  //   (data) => {
  //     console.log(data);
  //   });
  
  // User.findOneAndUpdate(
  //   {
  //     _id: req.user._id,
  //     "wallet.items.id": 
  //       req.params.id
        
            
  //   },
  //   {$set: { "items.$.amount" : req.body.amount}}, 
    
  //   {safe: true, new : true}, 
  //   (err, user) => {
  //   // Handle any possible database errors
  //     if (err) {
  //       console.log(err)
  //       return res.status(500).send(err)};
  //     console.log(user);
  //     return res.send(user.wallet);
  //   })
});

module.exports = router;