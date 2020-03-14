//const User = require('../models/user');
const Activity = require('../models/activity');
//const Tour = require('../../models/tour');
const mongoose = require('mongoose');
const path = require('path');

module.exports = {

  create_notific_html: async function (creatorId,action,tourId, time, response) {
      var username
      var tourname
      var profileImage

//   await User.findOne({_id: creatorId })
//   .exec()
//   .then(user => {
//       if (user) {
//           username = user.fName + " " + user.lName
//           profileImage = user.profileImage
//       } else {
//           username = "user"
//           profileImage = "default_profile.png"
//       }
//   })
//   .catch(err => {
//       console.log(err);
//   });

//   await Tour.findOne({_id: tourId })
//   .exec()
//   .then(tour => {
//       if (tour) {
//           tourname = tour.tourName
//       } else {
//           tourname = "tour"
//       }
//   })
//   .catch(err => {
//       console.log(err);
//   });
profileImage = "default_profile.png"
username = "user"
tourname = "tour"

  var readableTime = this.convert_date(time)

  var androidContent = username + " " + action + " " + tourname ;

  var content = username + " " + action + " " + tourname ;

  var data = {content:content, image:profileImage, androidContent: androidContent};

  return response(data)

  },
  convert_date: function(date) {

      return   date.getDate() + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear() + " " +  this.dateToTime(date)
  },
  dateToTime: function(date) {

      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      return strTime;
    }
}
