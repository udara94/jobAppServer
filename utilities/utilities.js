const User = require('../models/User');
const Activity = require('../models/activity');
const MyNotification = require('../models/mynotification');
const SubscribeJobTypes = require('../models/SubscribedJobType')
//const Tour = require('../../models/tour');
const Fcm = require('../api/controllers/fcmController');
const FcmTemp = require('../models/FcmTemp');
const mongoose = require('mongoose');
const path = require('path');

module.exports = {
  create_activity: function (jobType, userId, tourId, action, response) {
    var notificId = new mongoose.Types.ObjectId()
    const activity = new Activity({
      _id: notificId,
      creatorId: userId,
      tourId: tourId,
      date: new Date(),
      action: action,
    });
    activity
      .save()
      .then(act => {

        if (activity) {


          SubscribeJobTypes.find()
            .exec()
            .then(subsResult => {

              subsResult.forEach(element =>{
                var jobTypeArry = new Array();
                 jobTypeArry = element.jobType;
                
                 if(jobTypeArry.indexOf(jobType) >= 0){
                  console.log(element.userId);
                  Fcm.trigerNotifications(activity, element.userId);
                 }
              })

              FcmTemp.find()
                .exec()
                .then(tempTokens => {
                  var tempTokenList = []
                  tempTokens.forEach((eachToken) => {
                    if (eachToken.fcmtoken)
                      tempTokenList.push(eachToken.fcmtoken)
                  });

                  if (tempTokenList && tempTokenList.length > 0) {
                   // console.log(activity)
                    Fcm.tigerToAll(activity, tempTokenList);
                  }
                })
                .catch(err => {
                  console.log(err);
                });

            })
            .catch(err => {
              console.log(err);
              res.status(500).json({
                message: err.message
              });
            })
          //Fcm.trigerNotifications(activity);
        }

      })
      .catch(err => {
        console.log(err);
      });
    // User.find({})
    //   .select('_id notifications')
    //   .exec()
    //   .then(users => {
    //       var newUsers = []
    //       users.forEach((eachUser) => {

    //           if (eachUser._id.toString() != userId.toString()) {

    //               var newNotific = eachUser.notifications


    //               const myNotification = new MyNotification({
    //                 _id: new mongoose.Types.ObjectId(),
    //                 activityId: notificId,
    //                 isread: false,
    //               });
    //               myNotification
    //                 .save()
    //                 .then(act => {
    //                 })
    //                 .catch(err => {
    //                   console.log(err);
    //                 });


    //               newNotific.unshift(myNotification)
    //               if (eachUser._id) {
    //                   const tempUser = new User({
    //                       _id: eachUser._id,
    //                       notifications: newNotific,
    //                     });
    //                   newUsers.push(tempUser)
    //                 }
    //           } else{
    //             console.log("Creator");
    //           }
    //         });
    //         counter = newUsers.length
    //         newUsers.forEach((updatedUser) => {
    //           counter--
    //           if(updatedUser._id) {
    //               User.update({_id: updatedUser._id},
    //                   {
    //                       notifications: updatedUser.notifications,
    //                   })
    //                   .exec()
    //                   .then(res => {

    //                   })
    //                   .catch(err => {
    //                       console.log(err);
    //                   });
    //           }
    //           if (counter == 0) {
    //               if(response){
    //                 return response("success");
    //               } else {
    //                 return "success";
    //               }
    //           }
    //         });

    //   })

  },

  //     create_notific_html: async function (creatorId,action,tourId, time, response) {
  //         var username
  //         var tourname
  //         var profileImage

  //     await User.findOne({_id: creatorId })
  //     .exec()
  //     .then(user => {
  //         if (user) {
  //             username = user.fName + " " + user.lName
  //             profileImage = user.profileImage
  //         } else {
  //             username = "user"
  //             profileImage = "default_profile.png"
  //         }
  //     })
  //     .catch(err => {
  //         console.log(err);
  //     });

  //     await Tour.findOne({_id: tourId })
  //     .exec()
  //     .then(tour => {
  //         if (tour) {
  //             tourname = tour.tourName
  //         } else {
  //             tourname = "tour"
  //         }
  //     })
  //     .catch(err => {
  //         console.log(err);
  //     });
  // // iOS template
  // {/* <div style="background: #e9eef1;width: 100%; height: 100%;border:0;font-family: "Helvetica Neue";">
  //         <div style="">
  //         <div style="color: #757676;padding: 55px;line-height: 25%;font-size: 35px;"><span style="font-weight: bold;"> Nick Compton </span>
  //         commented on album <span style="font-weight: bold;">Sigiriya</span></div>
  //         <div style="color: #757676;padding: 55px;line-height: 25%;font-size: 35px;">
  //         Sunday 12:23 pm </div>
  //         </div>
  //         </div> */}

  // // Android Template
  // {/* <div style="background: #e9eef1;">
  // <div style="">
  //     <div style="color: #757676;padding: 5px;">
  //         <span style="font-weight: bold;">James Ford</span> added a new photo <span style="font-weight: bold;">Tea Factory</span>
  //         </div>
  //         <div style="color: #757676; padding: 5px;">Sunday 12:23 pm</div>
  //         </div>
  //         </div> */}


  //     var readableTime = this.convert_date(time)

  //     var androidContent = '<div style="background: #e9eef1;">\
  //                         <div style="">\
  //                         <div style="color: #757676;padding: 5px;"><span style="font-weight: bold;">' + username + " " + '</span>' +
  //                         action + " " + '<span style="font-weight: bold;">' + tourname + '</span></div>\
  //                         <div style="color: #757676;padding: 5px;">' + this.convert_date(time) + '</div>' +
  //                     '</div> ' +
  //                     '</div> '

  //     var content = '<div style="background: #e9eef1;width: 100%; height: 100%;border:0;font-family: "Helvetica Neue";">\
  //                     <div style="">\
  //                     <div style="color: #757676;padding: 25px;line-height: 35px;font-size: 35px;"><span style="font-weight: bold;">' + username + " " + '</span>' +
  //                     action + " " + '<span style="font-weight: bold;">' + tourname + '</span></div>\
  //                     <div style="color: #757676;padding: 50px;line-height: 25%;font-size: 35px;">' + this.convert_date(time) + '</div>' +
  //                     '</div> ' +
  //                     '</div> '



  //     var data = {content:content, image:profileImage, androidContent: androidContent};

  //     return response(data)

  //     },
  //     convert_date: function(date) {

  //         return   date.getDate() + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear() + " " +  this.dateToTime(date)
  //     },
  //     dateToTime: function(date) {

  //         var hours = date.getHours();
  //         var minutes = date.getMinutes();
  //         var ampm = hours >= 12 ? 'pm' : 'am';
  //         hours = hours % 12;
  //         hours = hours ? hours : 12; // the hour '0' should be '12'
  //         minutes = minutes < 10 ? '0'+minutes : minutes;
  //         var strTime = hours + ':' + minutes + ' ' + ampm;
  //         return strTime;
  //       }
}
