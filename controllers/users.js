const { session } = require('passport');
const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        //this method will take the entire user model, the instance of the model
        //and the password is going to hash the password 
        req.login(registeredUser, err => {
            if (err)
                return next(err);
//this will work when you create an account and then redirect to main page and give an access to a newly created user
//if not or no user is created then return an error.
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}


module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}


module.exports.login = (req, res) => {
    //if credentials are wrong, flash a message and redirect to login page.
    //expect us to give a strategy with local-passport
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
//this will check and return to a specific route you are requesting, when you 
//login to that route.
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

//Asynchronous request log out
module.exports.logout = function(req, res, next) {
    req.logout(function(err) {
      if (err) {
        
        return next(err); }
      req.flash('success', "Logout");
      res.redirect('/login');
       
    });
  };

