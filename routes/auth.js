const router = require('express').Router();
const Wallet = require('../model/Wallet');
const userValidation = require('../validation');
const bcrypt =  require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  // Validate the date before creating a user
  const {error} = userValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  
  // Check if the user already in the database
  const walletExist = await Wallet.findOne({username: req.body.username});
  if ( walletExist ) return res.status(400).send("User already exists");

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const wallet = new Wallet({
    username: req.body.username,
    password: hashedPassword
    
  });

  try {
    await wallet.save();
    console.log('New wallet: ', wallet);
    res.send({wallet: wallet.id});
  } catch(err){
    res.status(400).send(err);
   
  }
});

router.post('/login', async (req, res) => {
  // Validate the date before creating a user
  const {error} = userValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if the user in the database
  const walletExist = await Wallet.findOne({username: req.body.username});

  if ( !walletExist ) return res.status(400).send("Username not found");
  // check password
  const validPassword = await bcrypt.compare(req.body.password, walletExist.password);
  
  if (!validPassword ) return res.status(400).send("Invalid password");

  // Create and assign a token
  const token = jwt.sign({_id: walletExist._id}, process.env.TOKEN_SECRET );
  console.log('walletExist._id: ', walletExist._id);
  res.header('auth-token', token).send(token);
  //res.send('Logged in.');
});

module.exports = router;