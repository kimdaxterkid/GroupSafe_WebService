// var express = require('express');
// var router = express.Router();
module.exports = function(app, passport) {

  /* GET home page. */
  app.get('/', function(req, res, next) {
    // res.render('indexEJS', { title: 'Express' });
    // res.render('index.ejs');
    res.render('index');
  });

  app.get('/test', function(req, res, next) {
    res.render('index.ejs');
  });

  app.get('/login', function(req, res) {
    // res.send("HELLO");
    res.render('login', { message: req.flash('loginMessage') });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

// process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  app.get('/signup', function(req, res) {
    res.render('signup', { message: req.flash('signupMessage') });
  });

  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user : req.user
    });
  });

};
// module.exports = router;
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
