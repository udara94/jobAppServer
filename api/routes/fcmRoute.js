const express = require('express');
const router = express.Router();
const FCMController = require("../controllers/fcmController");
const verify = require('../middleware/veriftToken');

router.post("/registerToken", verify, FCMController.user_register_fcm_token);

router.post("/registerFCMWithoutToken", FCMController.register_fcm_token_without_user);




module.exports = router;
