const router = require('express').Router();
const User = require('../model/User');
const userValidation = require('../validation');
const bcrypt =  require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  // Validate the date before creating a user
  const {error} = userValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  
  // Check if the user already in the database
  const userExist = await User.findOne({username: req.body.username});
  if ( userExist ) return res.status(400).send("User already exists");

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    username: req.body.username,
    password: hashedPassword
  });

  try {
    await user.save();
    res.send({user: user.id});
  } catch(err){
    res.status(400).send(err);
   
  }
});

router.post('/login', async (req, res) => {
  // Validate the date before creating a user
  const {error} = userValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if the user in the database
  const userExist = await User.findOne({username: req.body.username});
  if ( !userExist ) return res.status(400).send("Username not found");
  // check password
  const validPassword = await bcrypt.compare(req.body.password, userExist.password);
  
  if (!validPassword ) return res.status(400).send("Invalid password");

  // Create and assign a token
  const token = jwt.sign({_id: userExist._id}, process.env.TOKEN_SECRET );
  res.header('auth-token', token).send(token);
  //res.send('Logged in.');
});

module.exports = router;