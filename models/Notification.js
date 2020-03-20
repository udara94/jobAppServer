const mongoose = require('mongoose');

const notificationShema = new mongoose.Schema({
    jobId : {
        type: String,
        required: true,
    },
    jobType:{
        type:String,
        required:true
    },
    employer:{
        type:String,
        required:true
    },
    postedDate:{
        type: Date,
        default: Date.now
    },
    notification: {
        type: String,
    }
});

module.exports = mongoose.model('Notification', notificationShema);