const express = require('express');
const router = express.Router();
const verify = require('../middleware/veriftToken');
const JobTypeController = require('../controllers/jobTypeController');


//get all jobs types
router.get('/', JobTypeController.get_job_types);

//submit a job type
router.post('/', verify, JobTypeController.add_job_type);

//specific job type
router.get('/:jobTypeId', verify, JobTypeController.get_specific_job_type);

//update job type
router.patch('/:jobTypeId', verify, JobTypeController.update_job_type)

//delete specific post
router.delete('/:jobTypeId', verify, JobTypeController.delete_job_type);


module.exports = router;