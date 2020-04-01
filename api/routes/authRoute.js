const router = require('express').Router();
const AuthController = require("../controllers/authController");


router.post('/register', AuthController.user_signup);

router.post('/token', AuthController.refresh_token);
//router.post('/login', AuthController.user_login)

module.exports = router;
