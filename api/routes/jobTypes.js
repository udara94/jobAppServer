const express = require('express');
const router = express.Router();
const JobTypeItem = require('../../models/JobTypeItem');
const JobTypeItemList = require('../../models/JobTypeItemList')
const verify = require('./veriftToken');

router.get('/expired', verify, async (req, res) =>{
    console.log("ododsofdsfj")
 });

//get all jobs
router.get('/', async (req, res) =>{
    try{
        const jobTypes = await JobTypeItem.find();  
        const jobTypeItemList = new JobTypeItemList({
            jobTypeItemList : jobTypes 
         });
        res.json(jobTypeItemList);
    }catch(err){
        res.json({
            message: err
        });
    }
 })


 
 //submit a job
 router.post('/', verify ,async (req, res)=>{
     const jobType = new JobTypeItem({
        jobType: req.body.jobType,
        isDeleted: req.body.isDeleted,
        jobCount: "0"  
     });
 
     try{
         const savedJobType = await jobType.save()
         res.json(savedJobType);
     }catch(err){
         res.json({message: err});
     }
 });
 
 // specific job
 router.get('/:jobTypeId', verify, async(req, res)=>{
     try{
         const post = await JobTypeItem.findById(req.params.jobTypeId);
         res.json(post);
     }catch(err){
         res.json({message: err});
     }
 })

  // update job
  router.patch('/:jobTypeId', verify, async(req, res)=>{
    try{
        const updateJobType = await JobTypeItem.updateOne(
            {_id: req.params.jobTypeId},
            {$set: {jobType:req.body.jobType}}
        );
        res.json(updateJobType);
    }catch(err){
        res.json({ message: err});
    }
})
 
 //delete specific post
 router.delete('/:jobTypeId', verify, async(req, res)=>{
     try{
         const removePost = await JobTypeItem.remove({ _id : req.params.jobTypeId});
         res.json(removePost);
     }catch(err){
         res.json({message: err});
     }
   
 })
 

 module.exports = router;