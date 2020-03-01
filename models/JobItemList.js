const mongoose = require('mongoose');

const jobItemListSchema = mongoose.Schema({
    jobItemList: {
        type:Array,
        required: true
    }
});

module.exports = mongoose.model('jobItemList', jobItemListSchema);

    