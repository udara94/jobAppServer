const mongoose = require('mongoose');

const userShema = new mongoose.Schema({
    mobile : {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userShema);