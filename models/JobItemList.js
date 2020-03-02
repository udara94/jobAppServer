const mongoose = require('mongoose');

const jobItemListSchema = mongoose.Schema({
    jobItemList: {
        type:Array,
        required: true
    },
    jobType:{
        type:String,
        required: true
    },
    jobRole:{
        type:String
    }
});

const jobRoleSchema = mongoose.Schema({
    jobRoleList: {
        type:Array,
        required: true
    }
});

var jobItemList = mongoose.model('jobItemList', jobItemListSchema);
var jobRoleList = mongoose.model('jobRoleList', jobRoleSchema);
module.exports = {
    jobItemList:jobItemList,
    jobRoleList: jobRoleList
}

    