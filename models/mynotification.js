const mongoose = require('mongoose');

const myNotificationSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  activityId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Activity'},
  isread: {type: Boolean, required: true},
});

module.exports = mongoose.model("MyNotification", myNotificationSchema);
