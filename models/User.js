const mongoose = require('mongoose');

const userShema = new mongoose.Schema({
    mobile : {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
    token: {
        type: String,
    },
    refreshToken: {
        type:String,
    }
});

module.exports = mongoose.model('User', userShema);