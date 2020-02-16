const router = require('express').Router();
const User = require('../models/User');
const  {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//validation
const Joi = require('@hapi/joi');







router.post('/register', async (req, res)=>{

//validate data
const {error} = registerValidation(req.body);
if(error) return res.status(400).send(error.details[0].message);


//checking if the user is already in the database
const emialExist = await User.findOne({ email: req.body.email});
if(emialExist) return res.status(400).send('Email already exist');

//Hash password
const salt = await bcrypt.genSalt(10);
const hashPassword = await bcrypt.hash(req.body.password, salt);

//create new user
   const user = new User({
       name: req.body.name,
       email: req.body.email,
       password: hashPassword
   })
   try{
       const saveUser = await user.save();
       res.send({user: user._id});
   }catch(err){
       res.status(400).send(err);
   }
 });

router.post('/login', async (req, res)=>{
    //validate data
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //checking if the user is already in the database
    const user = await User.findOne({ email: req.body.email});
    if(!user) return res.status(400).send('Email is not found');

    //password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid password');

    // create and assign token
    const token = jwt.sign({_id:user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
    //res.send('Logged in');




})


module.exports = router;
