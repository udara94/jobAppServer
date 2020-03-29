//const User = require('../models/user');
const Activity = require('../models/activity');
//const Tour = require('../../models/tour');
const mongoose = require('mongoose');
const path = require('path');

module.exports = {

  create_notific_html: async function (result, response) {

    var profileImage
    var employer;

    profileImage = "https://www.dailynews.lk/sites/default/files/news/2017/06/05/z_pv-Cambio-Software.jpg"
    employer = result.employer;



    var androidContent = "New Job Vacancy";

    var content = "New Job Vacancy";

    var data = { content: content, image: profileImage, androidContent: androidContent };

    return response(data)

  },
  convert_date: function (date) {

    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + " " + this.dateToTime(date)
  },
  dateToTime: function (date) {

    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
}
