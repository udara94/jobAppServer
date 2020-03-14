const User = require('../../models/User');
const { registerValidation, loginValidation } = require('../../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.user_signup = (req, res) => {

  //validate data
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);


  //checking if the user is already in the database
  //const emialExist = 
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'Mail exists'
        })
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              message: err.message
            });
          } else {

            //create new user
            const userModel = new User({
              name: req.body.name,
              email: req.body.email,
              password: hash
            })
            userModel
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: 'User created'
                });
              }).catch(err => {
                res.status(500).json({
                  message: err.message
                });
              });
          }
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: err.message
      });
    });

}

exports.user_login = (req, res) => {
  //validate data
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //checking if the user is already in the database
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.TOKEN_SECRET,
            {
              expiresIn: "48h"
            }
          );
          User.update({ email: req.body.email },
            {
              auth: token,
            }).exec()
            .catch(err => {
              console.log(err);
              res.status(500).json({
                message: err.message
              });
            });
          return res.status(200).json({
            message: 'Auth Successful',
            token: token,
            userId: user[0]._id,
            email: req.body.email
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: err.message
      });
    });
}
