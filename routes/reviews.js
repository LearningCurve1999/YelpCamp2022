const express = require('express');
const router = express.Router({ mergeParams: true });
//have default behavior to keep 2 params separate
//TO MERGE TWO DIFFERENT REQUEST PARAMETERS, SET TO TRUE
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
//Middleware areas from middleware.js
const Campground = require('../models/campground');
const Review = require ('../models/review');
// const reviewer = require ('../controllers/campgrounds');



//ERROR HANDLING
const ExpressError = require('../ErrorHandler/ExpressError');
const catchAsync = require('../ErrorHandler/catchAsync');


router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review Added');
    res.redirect(`/campgrounds/${campground._id}`);
}));
// Same as the past topics that discussed, create a route for reviews
//and then await the campground find the existing ID that were currently on
// specific showpage. and then add new Review and set the request to body
//and review file. this will create a review in the body of the page and
// it should have string for review and numbers for rating
// push every reviews and rating everytime you submit and redirect you to showpage



//the paths has it own main file that created called controllers, each controllers have reviews and users as well.
// Every modification can be done in controllers folder.

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    //Since req.params is an object, with properties, we can use "destructuring" 
    //syntax to pull the properties and their values.
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    //we wait to find the campground and we remove the reference to this review from reviews
    //array and then delete the entire review.

    //its going to take this ID and pull anything with that ID, in our case reviewId,
    //and reviews are just an array of ID that we structured over campgroundSchema,
    //So were pulling that out and delete
    await Review.findByIdAndDelete(reviewId);
    //We await, then mongoose is going to find parameter called "reviewId" object which have property value,
    //Delete the specific parameter.
    req.flash('success', 'Review Deleted')
    res.redirect(`/campgrounds/${id}`);
    //And redirect to campgrounds id showpage.
}));



module.exports = router;