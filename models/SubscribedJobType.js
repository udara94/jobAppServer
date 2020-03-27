const mongoose = require('mongoose');

const subscribedJobSchema = new mongoose.Schema({
    userId : {
        type: String,
        required: true,
    },
    jobType: {
        type: Array,
    }
});

module.exports = mongoose.model('subscribedJobs', subscribedJobSchema);