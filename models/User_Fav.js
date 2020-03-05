const mongoose = require('mongoose');

const userFavShema = new mongoose.Schema({
    userId : {
        type: String,
        required: true,
    },
    jobId: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('UserFav', userFavShema);