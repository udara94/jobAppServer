const mongoose = require('mongoose');

const JobItemSchema = mongoose.Schema({
    jobField:{type: String,required: true},
    jobType: {type:String,required: true},
    jobTypeName: {type:String,required: true},
    jobDescription: {type:Array},
    jobSkill: {type:Array},
    jobQualification:{type:Array},
    experience:{type:Array},
    salary:{type:String},
    address:{type:String},
    webSite:{type:String},
    jobRole: {type:String,required: true},
    employer: {type:String,required: true},
    employerEmail: {type:String,},
    imgUrl: {type:String,required: true},
    postedDate: {type: Date,default: Date.now},
    closingDate: {type:String,required: true},
    isExpired: {type:Boolean,required: true},
});

module.exports = mongoose.model('JobItem', JobItemSchema);

    