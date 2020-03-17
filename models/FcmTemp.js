const mongoose = require('mongoose');

const fcmTempSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  fcmtoken: {type: String, required: true},
});

module.exports = mongoose.model("FcmTemp", fcmTempSchema);
