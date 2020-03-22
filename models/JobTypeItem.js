const mongoose = require('mongoose');

const JobTypeItemSchema = mongoose.Schema({
    jobField:{
        type: String,
        required: true
    },
    jobType: {
        type:String,
        required: true
    },
    jobCount: {
        type:String
    },
    isDeleted: {
        type:Boolean,
        required: true
    }
});

module.exports = mongoose.model('JobTypeItem', JobTypeItemSchema);

    