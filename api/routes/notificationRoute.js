const express = require('express');
const router = express.Router();
const verify = require('../middleware/veriftToken');
const NotificationController = require('../controllers/notificationController');

//get all notifications
router.get('/',verify, NotificationController.get_all_notifications);

module.exports = router;