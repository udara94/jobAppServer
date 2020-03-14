const express = require('express');
const router = express.Router();
const verify = require('../middleware/veriftToken');
const JobController = require('../controllers/jobController');

//search by key words
router.get('/search',verify, JobController.search_jobs);

//get expired jobs
router.get('/expired', verify, JobController.get_expired_jobs); 

//get all jobs by job type
router.get('/', verify, JobController.get_all_jobs_by_type )

//get job roles by job type
router.get('/getjobrolebytype', verify, JobController.get_job_role_by_type)

//get the job list by job role and jobtype
router.get('/getjobsbyjobrole', verify, JobController.get_jobs_by_job_role )

//get specific job
router.get('/:jobId', verify, JobController.get_specific_job)

//submit a job
router.post('/', verify, JobController.add_new_job);

//update post
router.patch('/updatejob', verify, JobController.update_job)

//delete specific post
router.delete('/deletejob', verify, JobController.delete_job)

module.exports = router;