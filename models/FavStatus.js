const mongoose = require('mongoose');

const favStatusShema = new mongoose.Schema({
    isExist : {
        type: Boolean,
        required: true,
    }
});

module.exports = mongoose.model('FavStatus', favStatusShema);