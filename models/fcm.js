const mongoose = require('mongoose');

const fcmSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  // email: {
  //   type: String,
  //   required: true,
  //   unique: true,
  //   match:  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  // },
  fcmtoken: {type: String, required: true},
  userId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'}
});

module.exports = mongoose.model("Fcm", fcmSchema);
