const Fcm = require('../../models/fcm');
const FcmTemp = require('../../models/FcmTemp');
var admin = require("firebase-admin");
var serviceAccount = require("../../apic-jobs-firebase-adminsdk");
const mongoose = require('mongoose');
const User = require('../../models/User');
const HtmlString = require('../../utilities/generateHTMLString');

admin.initializeApp({
 credential: admin.credential.cert(serviceAccount),
 databaseURL: "https://apic-jobs.firebaseio.com"
});

exports.register_fcm_token_without_user = (req, res) =>{
  FcmTemp.findOne({fcmtoken: req.body.fcmtoken})
  .exec()
  .then(fcmTemp => {
    if(fcmTemp){
      res.status(200).json({
        message: 'FCM Token Update Successful.'
      });
    } else{
      const fcmToken = new FcmTemp({
        _id: new mongoose.Types.ObjectId(),
        fcmtoken: req.body.fcmtoken
      });
      fcmToken
        .save()
        .then(result => {
          res.status(201).json({
            message: 'FCM Token Registration Successful.'
          });
        })
        .catch(err => {
          res.status(500).json({
            message: err.message
          });
        });
    }
  })
  .catch(err => {
    res.status(500).json({
      message: err.message
    });
  });
}

exports.user_register_fcm_token = (req, res, next) => {
    User.findOne({_id: req.user.userId})
    .exec()
    .then(user => {
      if(user){
        Fcm.findOne({userId: user._id})
        .exec()
        .then(fcm => {
            console.log(fcm)
          if(fcm){
            
            Fcm.updateOne({userId: user._id}, {fcmtoken: req.body.fcmtoken})
              .exec()
              .then(result => {
                res.status(200).json({
                  message: 'FCM Token Update Successful.'
                });
              })
              .catch(err => {
                res.status(500).json({
                  message: err.message
                });
              });
          } else{
            const fcm = new Fcm({
              _id: new mongoose.Types.ObjectId(),
              userId: user._id,
              fcmtoken: req.body.fcmtoken
            });
            fcm
              .save()
              .then(result => {
                res.status(201).json({
                  message: 'FCM Token Registration Successful.'
                });
              })
              .catch(err => {
                res.status(500).json({
                  message: err.message
                });
              });
          }
        })
        .catch(err => {
          res.status(500).json({
            message: err.message
          });
        });
      } else{
        return res.status(401).json({
          message: "FCM Token Registration failed"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
  }

  module.exports.trigerNotifications = (userId, result) => {
      Fcm.find({
        userId: userId
      })
        .select('userId fcmtoken')
        .exec()
        .then(tokens => {
          //console.log("================");
          //console.log(tokens);
            var tokenList = []
            tokens.forEach((eachToken) => {
                  if(eachToken.fcmtoken)
                    tokenList.push(eachToken.fcmtoken)
              });


              if(tokenList && tokenList.length > 0){
                tigerToAll(tokenList, result);
              }
        })
        .catch(err => {
          console.log(err);
        });
}
module.exports.tigerToAll = (regIdArray, result) => {
  if(regIdArray.length < 1000){
    tigerNotifications(regIdArray, result);
  } else{
    const folds = regIdArray.length % 1000

    for (let i = 0; i < folds; i++) {
        let start = i * 1000,
            end = (i + 1) * 1000
        var registrationTokens = regIdArray.slice(start, end).map((item) => {
            return item
        });
        tigerNotifications(registrationTokens, result);
    }
  }
}

const tigerToAll = (regIdArray, result) => {
    if(regIdArray.length < 1000){
      tigerNotifications(regIdArray, result);
    } else{
      const folds = regIdArray.length % 1000

      for (let i = 0; i < folds; i++) {
          let start = i * 1000,
              end = (i + 1) * 1000
          var registrationTokens = regIdArray.slice(start, end).map((item) => {
              return item
          });
          tigerNotifications(registrationTokens, result);
      }
    }
}

const tigerNotifications = (registrationTokens, result) => {

  var message = result.employer + " posted new job vacancy for "+ result.jobRole;

    HtmlString.create_notific_html(result, function(response){
  
    
            var payload = {
              // notification: {
              //   body: convert_date(newActivity.date).toString(),
              //   title: newActivity.content,
              //   message: newActivity.content,
              //   sound : "default"
              // },
              data: {
                date: message,
                action: "new job",
                content: response.content,
                andoridContent: response.androidContent,
                image: response.image,
              }
            };
  
            var options = {
              priority: "high",
              timeToLive: 60*60*24
            };
  
            admin.messaging().sendToDevice(registrationTokens, payload, options)
              .then(function(response) {
                //console.log("successfully sent Notifications:");
                   //console.log("================");
               // console.log("registrationTokens:" +registrationTokens);
              })
              .catch(function(error) {
                console.log(error);
                console.log("Error sending Notifications:");
              });
      //  }
    });
  
  }

  const convert_date = (date) => {

    return   date.getDate() + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear() + " " +  dateToTime(date)
}
const dateToTime = (date) => {

    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}