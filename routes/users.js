const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../ErrorHandler/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)
//the paths has it own main file that created called controllers, each controllers have reviews and users as well.
// Every modification can be done in controllers folder.

router.get('/logout', users.logout)


module.exports = router;