const mongoose = require('mongoose');

const jobTypeItemListSchema = mongoose.Schema({
    jobTypeItemList: {
        type:Array,
        required: true
    }
});

module.exports = mongoose.model('jobTypeItemList', jobTypeItemListSchema);

    