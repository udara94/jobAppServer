const express = require('express');
const router = express.Router();
const FCMController = require("../controllers/fcm");
const verify = require('./veriftToken');

router.post("/registerToken", verify, FCMController.user_register_fcm_token);

module.exports = router;
