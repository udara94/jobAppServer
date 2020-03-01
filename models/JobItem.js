const mongoose = require('mongoose');

const JobItemSchema = mongoose.Schema({
    jobId: {
        type:String,
        required: true
    },
    jobType: {
        type:String,
        required: true
    },
    jobDescription: {
        type:String
    },
    jobRole: {
        type:String,
        required: true
    },
    employer: {
        type:String,
        required: true
    },
    employerEmail: {
        type:String,
    },
    imgUrl: {
        type:String,
        required: true
    },
    postedDate: {
        type: Date,
        default: Date.now
    },
    closingDate: {
        type:String,
        required: true
    },
    isExpired: {
        type:Boolean,
        required: true
    },
});

module.exports = mongoose.model('JobItem', JobItemSchema);

    