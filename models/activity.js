const mongoose = require('mongoose');

const activitySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  mynotificationId: {type: String},
  creatorId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
  tourId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Tour'},
  date: {type: Date, required: true},
  action: {type: String, required: true},
  content: {type: String},
  andoridContent: {type: String},
  image: {type: String},
  isread: {type: Boolean},
});

module.exports = mongoose.model("Activity", activitySchema);
