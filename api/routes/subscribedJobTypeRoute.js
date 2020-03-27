const express = require('express');
const router = express.Router();
const verify = require('../middleware/veriftToken');
const SubscribedJobTypeController = require('../controllers/subscribedJobTypesController');

//get all notifications
router.get('/',verify, SubscribedJobTypeController.get_subscribed_job_types);

router.post('/addJobTypeSubscription', verify, SubscribedJobTypeController.add_subscribed_job_types);

router.get('/subAll',verify, SubscribedJobTypeController.subscribe_all_job_types);

module.exports = router;