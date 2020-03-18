const mongoose = require('mongoose');

const subsJobListSchema = mongoose.Schema({
    jobTypeItemList: {
        type:Array,
        required: true
    },
    subsJobTypeItemList:{
        type:Array,
        required:true
    }
});

module.exports = mongoose.model('subsJobList', subsJobListSchema);

    