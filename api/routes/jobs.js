const express = require('express');
const router = express.Router();
const JobItem = require('../../models/JobItem');
const JobTypeItem = require('../../models/JobTypeItem');
const JobItemList = require('../../models/JobItemList').jobItemList;
const jobRoleList = require('../../models/JobItemList').jobRoleList;
const verify = require('./veriftToken');
const JobUtils = require('./JobUtils');
const moment = require('compare-dates');
const OpenJobs = require('./JobUtils');
const utilities = require('../../utilities/utilities');
const JobController = require('../controllers/job');

//search by key words
router.get('/search',verify, async (req, res) =>{
    try{
        var key = req.query.key;

        const jobs = await JobItem.find({
            "employer": { '$regex' : key, $options:"i"}
        });
        var jobListArry = new Array();
        jobListArry = OpenJobs.getOpenJobs(jobs);

        const jobItemList = new JobItemList({
            jobItemList: jobListArry,
            jobType: req.query.jobType
        });
        res.json(jobItemList);
    }catch(err){
        res.status(400).send('Bad request');
    }
 })


router.get('/expired', verify, async (req, res) => {
    try {
        const jobs = await JobItem.find();
        var jobListArry = new Array();
        jobListArry = OpenJobs.getExpiredJobs(jobs)

        const jobItemList = new JobItemList({
            jobItemList: jobListArry,
            jobType: "okok"
        });

        console.log(jobItemList)
        res.json(jobItemList);
    } catch (err) {
        res.status(400).send('Bad request');
    }
});
//==================================================================
//get all jobs by job type
//api/jobs
//===================================================================
router.get('/', verify, async (req, res) => {
    try {

        const limit = Math.max(0, req.query.limit)
        const offset = Math.max(0, req.query.offset)

        const jobs = await JobItem.find({ jobType: req.query.jobType })
            .limit(limit)
            .skip(offset);

        console.log(limit);
        console.log(offset);
        var jobListArry = new Array();
        jobListArry = OpenJobs.getOpenJobs(jobs);

        const jobItemList = new JobItemList({
            jobItemList: jobListArry,
            jobType: req.query.jobType
        });
        res.json(jobItemList);
    } catch (err) {
        res.status(400).send('Bad request');
    }
});

//===================================================================
//get job roles by job type
//===================================================================
router.get('/getjobrolebytype', verify, async (req, res) => {
    try {
        const jobs = await JobItem.find({ jobType: req.query.jobType });
        var jobRoleArry = new Array();
        jobRoleArry = OpenJobs.getJobRoleByJobType(jobs);

        const response = new jobRoleList({
            jobRoleList: jobRoleArry
        });
        console.log(response)
        res.json(response);
    } catch (err) {
        res.status(400).send('Bad request');
    }
});

//=====================================================================
// get the job list by job role and jobtype
//=====================================================================
router.get('/getjobsbyjobrole', verify, async (req, res) => {
    try {

        const jobs = await JobItem.find({
            jobType: req.query.jobType,
            jobRole: req.query.jobRole
        });

        var jobListArry = new Array();
        jobListArry = OpenJobs.getOpenJobs(jobs);;

        const jobItemList = new JobItemList({
            jobItemList: jobListArry,
            jobType: req.query.jobType,
            jobRole: req.query.jobRole
        });

        //console.log(jobItemList)
        res.json(jobItemList);
    } catch (err) {
        res.status(400).send('Bad request');
    }
});

//=========================================================
// get specific job
//=========================================================
router.get('/:jobId', verify, async (req, res) => {
    try {
        const post = await JobItem.findById(req.params.jobId);
        res.json(post);
    } catch (err) {
        res.status(400).send('Bad request');
    }
});

//========================================================================
//submit a job
//======================================================================
// router.post('/', verify, async (req, res) => {
//     const job = new JobItem({
//         jobId: req.body.jobId,
//         jobType: req.body.jobType,
//         jobDescription: req.body.jobDescription,
//         jobRole: req.body.jobRole,
//         employer: req.body.employer,
//         employerEmail: req.body.employerEmail,
//         imgUrl: req.body.imgUrl,
//         closingDate: req.body.closingDate,
//         isExpired: req.body.isExpired,
//     });

//     try {

//         //saving new job in job list
//         const savedJob = await job.save()

//         //get the jobtype id and update the job count by one
//         var jobTypeId = req.body.jobType;
//         const post = await JobTypeItem.findById(jobTypeId);
//         var jobCount = parseInt(post.jobCount) + 1;

//         const updateJobType = await JobTypeItem.updateOne(
//             { _id: jobTypeId },
//             { $set: { jobCount: jobCount.toString() } }
//         );
//         //utilities.create_activity(user._id,tour._id,"likes")
//         res.json(savedJob);
//     } catch (err) {
//         res.status(400).send('Bad request');
//     }
// });
router.post('/', verify, JobController.add_new_job);

//========================================================
// update post
//=========================================================
router.patch('/:postId', verify, async (req, res) => {
    try {
        const updatePost = await Post.updateOne(
            { _id: req.params.postId },
            { $set: { title: req.body.title } }
        );
        res.json(updatePost);
    } catch (err) {
        res.status(400).send('Bad request');
    }
});

//=================================================================
//delete specific post
//=================================================================
router.delete('/:postId', verify, async (req, res) => {
    try {
        const removePost = await Post.remove({ _id: req.params.postId });
        res.json(removePost);
    } catch (err) {
        res.status(400).send('Bad request');
    }

});
module.exports = router;