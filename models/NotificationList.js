const mongoose = require('mongoose');

const notificationListSchema = mongoose.Schema({
    notificationList: {
        type:Array,
        required: true
    }
});

module.exports = mongoose.model('notificationList', notificationListSchema);

    