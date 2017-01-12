/**
 * Created by Song on 10/29/2016.
 */
// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;

// load up the user model
var User       = require('../models/users');

// load the auth variables
// var configAuth = require('./auth'); // use this one for testing

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // local login
    passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, username, password, done) {
        console.log("Logging in: " + req.body);
        process.nextTick(function() {
            User.findOne({ 'local.username' : username }, function(err, user) {
                if(err) return done(err);
                //if (!user) return done(null, false, req.flash('loginMessage', 'No user found'));
                // check for bcrypted password
                // if (!user.validPassword(password))
                //     return done(null, false, req.flash('loginMessage', 'Wrong password'));
                if (!user || user.local.password !== password) {
                    return done(null, false);
                }
                else return done(null, user);
            });
        });
    }));

    // local sign up
    passport.use('local-signup', new LocalStrategy( {
        usernameField :'username',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, username, password, done) {

        // async
        process.nextTick(function() {
            // if the user is not already logged in
            if (!req.user) {
                User.findOne( {'local.username' : username}, function(err, user) {
                    if (err) return done(err);
                    if (user)
                        return done(null, false, req.flash('signupMessage', 'There is no user with that username'));
                    else {
                        var newUser = new User();
                        console.log("Printing Body");
			            console.log(req.body);
                        newUser.local.username = req.body.username;
                        newUser.local.phoneNumber = req.body.phoneNumber;
                        newUser.local.firstName = req.body.firstName;
                        newUser.local.lastName = req.body.lastName;
                        newUser.local.password = req.body.password; //newUser.generateHash(password);

                        newUser.save(function(err) {
                            if (err) {
                                console.log("ERROR HERE");
                                return done(err);
                            }
                            console.log("Created user:\n" + newUser);
                            return done(null, newUser);
                        })

                    }
                })
            }
            //if the user is logged in but has no local account
            // not useful at the moment since we don't have other login options
            else if (!req.user.local.username) {
                // ...presumably they're trying to connect a local account
                // BUT let's check if the email used to connect a local account is being used by another user
                User.findOne({ 'local.username' : username }, function(err, user) {
                    if (err) return done(err);
                    if (user) {
                        return done(null, false, req.flash('loginMessage', 'That email is already taken.'));
                    }
                    else {
                        var user = req.user;
                        user.local.username = username;
                        user.local.password = user.generateHash(password);
                        user.save(function(err) {
                            if (err) return done(err);
                            return done(null, user);
                        });
                    }
                });
            }
            else {
                return done(null, req.user);
            }
        });
    }));
}
