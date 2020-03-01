const mongoose = require('mongoose');

const JobTypeItemSchema = mongoose.Schema({
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

    