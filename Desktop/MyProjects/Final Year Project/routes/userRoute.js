const express = require("express");
const router = express.Router();
const userLogin = require("../controller/userLogin");
const singupController = require("../controller/signup")
const passport = require("passport");

router.route('/')
    .get(userLogin.getHome);
    
router.route('/signup')
    .get(singupController.getSignup)
    .post(singupController.postSignup);

router.route('/adminSignup')
    .get(singupController.getAdminSignup)
    .post( singupController.postAdminSignup);

router.route('/login')
    .get(userLogin.getUserLogin)
    .post(passport.authenticate("local", {
        failureRedirect: '/login',
        failureFlash: true
    }), userLogin.postUserLogin);


router.route('/AdminLogin')
    .get(userLogin.getAdminLogin)
    .post( passport.authenticate("local", {
        failureRedirect: '/AdminLogin',
        failureFlash: true
    }), userLogin.postAdminLogin);

router.get('/logout', userLogin.userLogout);

module.exports = router;