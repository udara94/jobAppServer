const express = require('express');
const router = express.Router();
const JobItem = require('../models/JobItem');
const JobItemList = require('../models/JobItemList').jobItemList;
const verify = require('./veriftToken');
const UserFavJobs = require('../models/User_Fav');
const mongoose = require('mongoose');
const FavStatus = require('../models/FavStatus');
mongoose.Promise = require('bluebird');


//=============================================================
// is favourite job
//=============================================================
router.get('/isfavourite', verify, async(req, res)=>{
    try{
        const favJob = await UserFavJobs.countDocuments({ 
            userId : req.user._id,
            jobId : req.query._id
        });

        var status = false;

        if(favJob == 0){
            status = false;
        }else{
            status = true;
        }
        
        const favStatus = new FavStatus({
            isExist: status
        });

        res.json(favStatus);
    }catch(err){
        res.json({message: err});
    }
  
});

//========================================================
//get fav jobs
//========================================================
router.get('/getfavjobs', verify, async (req, res) =>{

        //   const favJobs = await UserFavJobs.find({userId: req.user._id});
        UserFavJobs.find({userId: req.user._id}).then(function(user){
            var favJobItems = [];
            user.forEach(function(u){
                //console.log(u);
                var jobId = u.jobId;
                favJobItems.push(JobItem.findById(jobId));
            });
            return Promise.all(favJobItems);
        }).then(function(jobList){
            const jobItemList = new JobItemList({
                jobItemList : jobList 
             });
            res.send(jobItemList)
        }).catch(function(err){
            res.status(500).send('one of the queries failed', error);
        });
 });

 //=========================================================
 //add favourite jobs
 //=========================================================
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


//==============================================================
// delete favourite job
//==============================================================
router.delete('/delete', verify, async(req, res)=>{
    try{
        console.log(req.query.jobType);
        const removePost = await UserFavJobs.deleteMany({ jobId : req.query._id});
        res.json(removePost);
    }catch(err){
        res.json({message: err});
    }
  
});
module.exports = router;