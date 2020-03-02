const express = require('express');
const router = express.Router();
const JobItem = require('../models/JobItem');
const JobTypeItem = require('../models/JobTypeItem');
const JobItemList = require('../models/JobItemList').jobItemList;
const jobRoleList = require('../models/JobItemList').jobRoleList;
const verify = require('./veriftToken');
const JobUtils = require('./JobUtils');

//get all jobs
// router.get('/',verify, async (req, res) =>{
//     try{
//         const jobs = await JobItem.find();
//         res.json(jobs);
//     }catch(err){
//         res.json({
//             message: err
//         });
//     }
//  })


//get all jobs by job type
router.get('/', verify, async (req, res) =>{
    try{
      const jobs = await JobItem.find({jobType: req.query.jobType});
      const jobItemList = new JobItemList({
        jobItemList : jobs ,
        jobType: req.query.jobType
     });
        res.json(jobItemList);
    }catch(err){
        res.json({
            message: err
        });
    }
 })

 //get job roles by job type
 router.get('/getjobrolebytype', verify, async (req, res) =>{
    try{
      const jobs = await JobItem.find({jobType: req.query.jobType});
      var jobRoleArry = new Array();

      jobs.forEach(element =>{
         // console.log(element.jobRole);
          if(!jobRoleArry.includes(element.jobRole)){
              jobRoleArry.push(element.jobRole);
          }
      });

      const response = new jobRoleList({
        jobRoleList : jobRoleArry
      })

    console.log(response)
        res.json(response);
    }catch(err){
        res.json({
            message: err
        });
    }
 })

 function inArray(jobRole, jobRoleArry) {
    var length = jobRoleArry.length;
    for(var i = 0; i < length; i++) {
        if(jobRoleArry[i] == jobRole)
            return true;
    }
    return false;
}
 
 //submit a job
 router.post('/', verify ,async (req, res)=>{
     const job = new JobItem({
        jobId: req.body.jobId,
        jobType: req.body.jobType,
        jobDescription: req.body.jobDescription,
        jobRole: req.body.jobRole,
        employer: req.body.employer,
        employerEmail: req.body.employerEmail,
        imgUrl: req.body.imgUrl,
        closingDate: req.body.closingDate,
        isExpired: req.body.isExpired,
     });
 
     try{

        //saving new job in job list
        const savedJob = await job.save()

        //get the jobtype id and update the job count by one
        var jobTypeId = req.body.jobType;
        const post = await JobTypeItem.findById(jobTypeId);
        var jobCount = parseInt(post.jobCount) + 1;
         
        const updateJobType = await JobTypeItem.updateOne(
            {_id: jobTypeId},
            {$set: {jobCount:jobCount.toString()}}
        );
         res.json(savedJob);
     }catch(err){
         res.json({message: err});
     }
 });
 
 // specific job
 router.get('/:jobId', verify, async(req, res)=>{
     try{
         const post = await JobItem.findById(req.params.jobId);
         res.json(post);
     }catch(err){
         res.json({message: err});
     }
 })
 
 //delete specific post
 router.delete('/:postId', verify, async(req, res)=>{
     try{
         const removePost = await Post.remove({ _id : req.params.postId});
         res.json(removePost);
     }catch(err){
         res.json({message: err});
     }
   
 })
 
 // update post
 router.patch('/:postId', verify, async(req, res)=>{
     try{
         const updatePost = await Post.updateOne(
             {_id: req.params.postId},
             {$set: {title: req.body.title}}
         );
         res.json(updatePost);
     }catch(err){
         res.json({ message: err});
     }
 })
 module.exports = router;