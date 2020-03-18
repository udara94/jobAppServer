const mongoose = require('mongoose');

const notificationShema = new mongoose.Schema({
    jobId : {
        type: String,
        required: true,
    },
    notification: {
        type: String,
    }
});

module.exports = mongoose.model('Notification', notificationShema);