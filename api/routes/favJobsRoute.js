const express = require('express');
const router = express.Router();
const verify = require('../middleware/veriftToken');
const mongoose = require('mongoose');
const FavController = require('../controllers/favJobsController')
mongoose.Promise = require('bluebird');


//is favourite job
router.get('/isfavourite', verify, FavController.get_is_favourite);

//get fav jobs
router.get('/getfavjobs', verify, FavController.get_fav_jobs);

//add favourite jobs
router.post('/addfavjobs', verify, FavController.add_fav_job);

//delete favourite job
router.delete('/delete', verify, FavController.delete_fav_job)

module.exports = router;