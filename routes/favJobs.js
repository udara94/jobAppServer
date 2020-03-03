const express = require('express');
const router = express.Router();
const JobItem = require('../models/JobItem');
const JobTypeItem = require('../models/JobTypeItem');
const JobItemList = require('../models/JobItemList').jobItemList;
const jobRoleList = require('../models/JobItemList').jobRoleList;
const verify = require('./veriftToken');
const UserFavJobs = require('../models/User_Fav');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

//get fav jobs
router.get('/getfavjobs', verify, async (req, res) =>{
    try{
      const favJobs = await UserFavJobs.find({userId: req.user._id});
    
    var favJobArry = new Array();

    (await JobItem.find({_id: "5e5bdc235ef42f3fc8a52b97"})).forEach(element=>{
        console.log(element.jobType);
    })
    // favJobs.forEach(function(u){
    //     var job = JobItem.find({_id: u.jobId});
    //     console.log(job);
    //    // favJobArry.push(JobItem.findById(u.jobId))
    // });
    // JobItem.find({jobType: "5e5b62f67fafed392c5f7905"})

    // Promise.all(favJobArry);
    // const jobItemList = new JobItemList({
    //     jobItemList : jobs ,
    //     jobType: req.query.jobType
    //  });
   // console.log(favJobArry)

    res.json(favJobs)

    }catch(err){
        res.json({
            message: err
        });
    }
 })

 async function getJobItems(favJobs, callback){
     for(let element = 0; element < favJobs.length; element++){
        var jobId = favJobs[element].jobId;
       // console.log(jobId);
        //const jobItem = await JobItem.findById(jobId);
        await callback(JobItem.findById(jobId));
     }
 }
 //add favourite jobs
 router.post('/addfavjobs', verify ,async (req, res)=>{
    const favJob = new UserFavJobs({
        userId: req.user._id,
        jobId: req.query._id,
    });

    try{

       //saving new job in job list
       const saveFavJob = await favJob.save()

        res.json(saveFavJob);
    }catch(err){
        res.json({message: err});
    }
});

module.exports = router;