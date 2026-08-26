const express = require('express');
const authController = require("../controllers/authController")
const rateLimit = require("express-rate-limit")



const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,

    message:{
        success:false,
        message:"Too many login attempts. please try again later."
    }
});


router.post('/register',authController.registerUser);

router.post('/login',loginLimiter, authController.loginUser);

router.post('/forgot-password', authController.forgotPassword);

router.post('/reset-password/:token', authController.resetPassword);

router.post('/refresh-token', authController.refreshAccessToken);

router.post('/logout', authController.logoutUser);


module.exports = router;