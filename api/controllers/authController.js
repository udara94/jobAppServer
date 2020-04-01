const User = require('../../models/User');
const { registerValidation, loginValidation } = require('../../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const FcmTemp = require('../../models/FcmTemp');


exports.refresh_token = (req, res) => {


  const refreshToken = req.body.refreshToken;
  if (refreshToken == null) return res.status(401);
  User.find({
    refreshToken: refreshToken
  })
    .exec()
    .then(user => {
      if (user) {
        if (user[0].refreshToken != null) {
          var token = user[0].refreshToken;
          jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, useres) => {
            if (err) return res.send(403);
            const accessToken = generateAccessToken(user[0]);
            User.updateOne({ mobile: user[0].mobile },
              {
                $set: {
                  token: accessToken,
                }
              }).exec()
              .then(response => {
                res.json({ token: accessToken })
              })
              .catch(err => {
                res.status(500).json({
                  message: err.message
                });
              });
          })
        }
      } else {
        return res.status(403)
      }
    })
}

exports.user_signup = (req, res) => {

  //validate data
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //checking if the user is already in the database
  User.find({ mobile: req.body.mobile })
    .exec()
    .then(user => {
      console.log("is user: " + user.length)
      if (user.length >= 1) {
        //login
        const token = generateAccessToken(user[0]);
        const refreshToken = jwt.sign({
          mobile: user[0].mobile,
          userId: user[0]._id
        },
          process.env.REFRESH_TOKEN_SECRET);

        User.updateOne({ mobile: req.body.mobile },
          {
            $set: {
              token: token,
              refreshToken: refreshToken
            }
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
          refreshToken: refreshToken,
          userId: user[0]._id,
          mobile: user[0].mobile
        });

      } else {
        //create new user
        const userModel = new User({
          mobile: req.body.mobile,
        })
        userModel
          .save()
          .then(result => {
            delete_tempToken(req.body.fcmtoken);
            const token = generateAccessToken(result);
            const refreshToken = jwt.sign({
              mobile: result.mobile,
              userId: result._id
            },
              process.env.REFRESH_TOKEN_SECRET)
            User.updateOne({ mobile: result.mobile },
              {
                $set: {
                  token: token,
                  refreshToken: refreshToken
                }
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
              refreshToken: refreshToken,
              userId: result._id,
              mobile: result.mobile
            });
          }).catch(err => {
            res.status(500).json({
              message: err.message
            });
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

function generateAccessToken(user) {
  
  return jwt.sign(
    {
      mobile: user.mobile,
      userId: user._id
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "35m"
    }
  )
}

function delete_tempToken(fcmToken) {
  FcmTemp.deleteMany({
    fcmtoken: fcmToken
  })
    .exec()
    .then(fcmTemp => {
      console.log("Successfully deleted");
    })
    .catch(err => {
      console.log(err);
    })
}

// function user_login(mobile, user) {
//   bcrypt.compare(mobile, user.mobile, (err, result) => {
//     if (err) {
//       return res.status(401).json({
//         message: "Auth failed"
//       });
//     }
//     if (result) {
//       const token = jwt.sign(
//         {
//           mobile: user.mobile,
//           userId: user._id
//         },
//         process.env.TOKEN_SECRET,
//         {
//           expiresIn: "48h"
//         }
//       );
//       User.update({ mobile: mobile },
//         {
//           auth: token,
//         }).exec()
//         .catch(err => {
//           console.log(err);
//           res.status(500).json({
//             message: err.message
//           });
//         });
//       return res.status(200).json({
//         message: 'Auth Successful',
//         token: token,
//         userId: user._id,
//         mobile: mobile
//       });
//     }
//     res.status(401).json({
//       message: "Auth failed"
//     });
//   });
// }

// exports.user_login = (req, res) => {
//   //validate data
//   const { error } = loginValidation(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   //checking if the user is already in the database
//   User.find({ mobile: req.body.email })
//     .exec()
//     .then(user => {
//       if (user.length < 1) {
//         return res.status(401).json({
//           message: "Auth failed"
//         });
//       }
//       bcrypt.compare(req.body.password, user[0].password, (err, result) => {
//         if (err) {
//           return res.status(401).json({
//             message: "Auth failed"
//           });
//         }
//         if (result) {
//           const token = jwt.sign(
//             {
//               email: user[0].email,
//               userId: user[0]._id
//             },
//             process.env.TOKEN_SECRET,
//             {
//               expiresIn: "48h"
//             }
//           );
//           User.update({ email: req.body.email },
//             {
//               auth: token,
//             }).exec()
//             .catch(err => {
//               console.log(err);
//               res.status(500).json({
//                 message: err.message
//               });
//             });
//           return res.status(200).json({
//             message: 'Auth Successful',
//             token: token,
//             userId: user[0]._id,
//             email: req.body.email
//           });
//         }
//         res.status(401).json({
//           message: "Auth failed"
//         });
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         message: err.message
//       });
//     });
// }
