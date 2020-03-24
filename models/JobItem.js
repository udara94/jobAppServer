const mongoose = require('mongoose');

const JobItemSchema = mongoose.Schema({
    jobField:{type: String,required: true},
    jobType: {type:String,required: true},
    jobDescription: {type:String},
    jobSkill: {type:String},
    jobQualification:{type:String},
    experience:{type:String},
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

    