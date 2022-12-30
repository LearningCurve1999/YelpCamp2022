const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../ErrorHandler/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
//Middleware areas to use them from middleware.js, 
//you have to require them each route that needs to apply
//And pass in on each route. 

//Cloudinary Storage
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
//Were saying that, when i upload a photo store this to this variable called 'Storage '
//I created with cloudinary

const Campground = require('../models/campground');
// const ExpressError = require('../ErrorHandler/ExpressError');


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))
//the paths has it own main file that created called controllers, each controllers have reviews and users as well.
// Every modification can be done in controllers folder.

router.get('/new', isLoggedIn, campgrounds.renderNewForm)
//This route is refactor in controllers folder
router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))


module.exports = router;