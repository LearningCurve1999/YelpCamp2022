const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./ErrorHandler/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
//to check if there is current ID or account active or user
//if the user exist, then pass through the campground or before they can access
//if not throw an error and redirect to login page
        req.session.returnTo = req.originalUrl
//req.originalUrl, it retains the original request URL when you login to that
//specific route.
        req.flash('error', 'You must be Logged In');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    console.log(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
//To check if the author and the currentId login is matching, then you will have an access to do some stuff
//That is priviledge to the specific user. 
//If not then throw an erro message and return to campgrounds.id
        req.flash('error', 'Invalid User');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
//To check if the author and the currentId login is matching, then you will have an access to do some stuff
//That is priviledge to the specific user. 
//If not then throw an erro message and return to campgrounds.id
        req.flash('error', 'Invalid User');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}   //After destructuring in schema.js file, we want to make sure that it should follow that structure we want. here we should define our joi object
//the object has a body, that body need to request and pass a validation
//and catch that corresponding error and return its message when one of the following are missing.

