const Fcm = require('../../models/fcm');
var admin = require("firebase-admin");
var serviceAccount = require("../../firebase-adminsdk");
const mongoose = require('mongoose');
const User = require('../../models/User');
const HtmlString = require('../../utilities/generateHTMLString');

admin.initializeApp({
 credential: admin.credential.cert(serviceAccount),
 databaseURL: "https://fcmtoken-45f7f.firebaseio.com"
});

exports.user_register_fcm_token = (req, res, next) => {
    //console.log("user id: "+req.user.userId)
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
                //console.log(result);
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
              fcmtoken: "5e6b374aa5d"
            });
            fcm
              .save()
              .then(result => {
               // console.log(result);
                res.status(201).json({
                  message: 'FCM Token Registration Successful.'
                });
              })
              .catch(err => {
               // console.log(err);
               // console.log("sswewfwewee");
                res.status(500).json({
                  message: err.message
                });
              });
          }
        })
        .catch(err => {
          //console.log(err);
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
      //console.log(err);
      res.status(500).json({
        message: err.message
      });
    });
  }

  module.exports.trigerNotifications = (activity) => {
    if (activity){
      Fcm.find()
        .select('userId fcmtoken')
        .exec()
        .then(tokens => {
            var tokenList = []
            tokens.forEach((eachToken) => {
                if (eachToken.userId.toString() != activity.creatorId.toString()) {
                  if(eachToken.fcmtoken)
                    tokenList.push(eachToken.fcmtoken)
                }
              });

              if(tokenList && tokenList.length > 0){
                tigerToAll(activity, tokenList);
              }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
        console.log("Notification Not Found");
    }
}

const tigerToAll = (activity, regIdArray) => {
    if(regIdArray.length < 1000){
      tigerNotifications(activity, regIdArray);
    } else{
      const folds = regIdArray.length % 1000

      for (let i = 0; i < folds; i++) {
          let start = i * 1000,
              end = (i + 1) * 1000
          var registrationTokens = regIdArray.slice(start, end).map((item) => {
              return item
          });
          tigerNotifications(activity, registrationTokens);
      }
    }
}

const tigerNotifications = (activity, registrationTokens) => {

    HtmlString.create_notific_html(activity.creatorId, activity.action, activity.tourId, activity.date, function(response){
  
          if(activity){
            var payload = {
              // notification: {
              //   body: convert_date(newActivity.date).toString(),
              //   title: newActivity.content,
              //   message: newActivity.content,
              //   sound : "default"
              // },
              data: {
                _id: activity._id.toString(),
                creatorId: activity.creatorId.toString(),
                tourId: activity.tourId.toString(),
                date: convert_date(activity.date).toString(),
                action: activity.action,
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
                console.log("successfully sent Notifications:");
                console.log("registrationTokens:" +registrationTokens);
              })
              .catch(function(error) {
                console.log(error);
                console.log("Error sending Notifications:");
              });
        }
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