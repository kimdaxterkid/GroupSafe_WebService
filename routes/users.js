var express = require('express');
var router = express.Router();
var user = require('../models/users');
var group = require('../models/groups');
/* GET users listing. */
module.exports = function(app, passport) {
    app.get('/users', isLoggedIn, function(req, res) {
        user.find(function(err, users) {
            // if there is an error retrieving, send the error. nothing after res.send(err)
            if (err) {
                res.send(err);
            }
            console.log(users);
            res.json(users); // return all todos in JSON format
        });
    });
    app.get('/users/logout', function(req, res) {
        req.logout();
        res.redirect('/'); //TODO figureout what to send back
    });
    /******* TEST ******/
    app.get('/users/login', function(req, res) {
        res.render('login.ejs');
    });

    app.get('/users/signup', function(req, res) {
        res.render('signup');
    });

    /****** END TEST ******/

    app.post('/users/login', passport.authenticate('local-login'),
        function(req, res) {
            console.log("user login");
            res.send(req.user ? 200 : 401);
        }
    );
    //app.post('/users/login', passport.authenticate('local-login', {
    //    successRedirect : '/users', // figure out what to send back
    //    failureRedirect : '/',
    //    failureFlash : true
    //}));

    //app.post('/users/signup',
    //    passport.authenticate('local-signup', { failureRedirect: '/login' }),
    //    function(req, res) {
    //        res.redirect('/');
    //    });

    app.post('/users/signup', passport.authenticate('local-signup'),
        function(req, res) {
            console.log("user signup");
            res.send(req.user ? 200 : 401);
        }
    );


    // app.post('/users/signup', passport.authenticate('local-signup', {
    //     successRedirect : '/',
    //     failureRedirect : '/index',
    //     failureFlash : true
    // }));

    app.get('/users/:username', function(req, res, next){
        user.findOne({"local.username":req.params.username}, function(err, theUser){
            if (err) {
                res.send(err);
            }
            if (!theUser) {
                res.send('There is no account for this username.');
            }
            else {
                var sendJson = {
                    "username" : theUser.local.username,
                    "phoneNumber" : theUser.local.phoneNumber,
                    "firstName" : theUser.local.firstName,
                    "lastName" : theUser.local.lastName
                };
                res.json(sendJson);
            }

        });
    });

    app.put('/users/:username', function(req,res, next){
        var user_name = req.params.username;
        if (req.body.firstName) {
            var first = req.body.firstName;
            user.findOneAndUpdate({ "local.username":user_name }, { firstName:first }, function(err, theUser){
                if (err) {
                    res.send(err);
                }
                else {
                    console.log(theUser);
                }
            });
        }
        if (req.body.lastName) {
            var last = req.body.lastName;
            user.findOneAndUpdate({ 'local.username':user_name }, { lastName:last }, function(err, theUser){
                if (err) {
                    res.send(err);
                }
                else {
                    console.log(theUser);
                }
            });
        }
        if (req.body.password) {
            var pass = req.body.password;
            user.findOneAndUpdate({ 'local.username':user_name }, { password:pass }, function(err, theUser){
                if (err) {
                    res.send(err);
                }
                else {
                    console.log(theUser);
                }
            });
        }
        //TODO Send a json object
        res.send("user update.")
    });

    app.delete('/users/:username', function(req, res, next){
        user.findOne({"local.username":req.params.username}, function(err, theUser){
            if (err) {
                res.send(err);
            }
            if (!theUser) {
                res.send('There is no account for this username.');
            }
            else {
                theUser.remove(function(err) {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        res.send("user deleted.");
                    }
                });
            }
        });
    });

    app.delete('/users/:username/:groupid', function(req, res, next){
        user.findOne({"local.username":req.params.username}, function(err, theUser){
            if (err) {
                res.send(err);
            }
            if (!theUser) {
                res.send('There is no account for this username.');
            }
            else {
                group.findOne({"groupName":req.params.groupid}, function(err, theGroup) {
                    if (err) {
                        res.send(err);
                    }
                    if (!theGroup) {
                        res.send('There exists no group for this groupid.');
                    }
                    else {
                        var mems = theGroup.members;
                        var i = mems.indexOf(req.params.username);
                        if (i != -1) {
                            mems.splice(i, 1);
                        }
                        theGroup.members = mems;
                        theGroup.save(function(err, newGroup){
                            if (err) {
                                res.send(err);
                            }
                            else {
                                res.json(newGroup);
                            }
                        });
                    }
                });
            }
        });
    });
}

// router.get('/', function(req, res, next) {
//       user.find(function(err, users) {
//         // if there is an error retrieving, send the error. nothing after res.send(err)
//         if (err) {
//             res.send(err);
//         }
//         console.log(users);
//         res.json(users); // return all todos in JSON format
//     });
// });
//
// router.post("/", function(req, res, next){
//     var user_name = req.body.username;
//     var user_phone = req.body.phoneNumber;
//     var first_name = req.body.firstName;
//     var last_name = req.body.lastName;
//     var user_password = req.body.password;
//     if (!validateAlphabetNumeric(user_name)){
//         console.log('username not valid');
//         res.send('username not valid');
//         return;
//     }
//     if (!validateAlphabet(first_name)){
//         console.log('first name not valid');
//         res.send('first name not valid');
//         return;
//     }
//     if (!validateAlphabet(last_name)){
//         console.log('last name not valid');
//         res.send('last name not valid');
//         return;
//     }
//     if (user_password.length < 4){
//         console.log('password not valid');
//         res.send('password needs at least 4 chars');
//         return;
//     }
//     if (user_phone.length < 10){
//         console.log('phone not valid');
//         res.send('phone number needs at least 10 numbers');
//         return;
//     }
//     user.findOne({"local.username": user_name}, function (err, theUser) {
//         // if it doesn't exist
//         if (err) {
//             console.log(err);
//             res.send(err);
//         }
//         if(!theUser) {
//             var newUser = new User();
//             newUser.local.username = user_name;
//             newUser.local.phoneNumber = user_phone;
//             newUser.local.firstName = first_name;
//             newUser.local.lastName = last_name;
//             newUser.local.password = user_password; //newUser.generateHash(password);
//             newUser.save(function(err) {
//                 if (err) return done(err);
//                 console.log(newUser);
//                 return done(null, newUser);
//             });
//
//             // user.local.create({
//             //     username: user_name,
//             //     phoneNumber: user_phone,
//             //     firstName: first_name,
//             //     lastName: last_name,
//             //     password: user_password,
//             //     groups: []
//             // }, function (err, newUser) {
//             //     if (err) {
//             //         res.send(err);
//             //     }
//             //     console.log(newUser);
//             //     user.findOne({"local.username" : newUser.username}, function (err, newUser) {
//             //         if (err) {
//             //             res.send(err);
//             //         }
//             //         console.log(newUser);
//             //         res.json(newUser);
//             //     });
//             // });
//         }
//         else {
//             console.log("The username " + user_name + " already exists. Please pick another name");
//             res.send("The username " + user_name + " already exists. Please pick another name");
//         }
//     });
// });
//
// // router.get('/getUser', function(req, res, next){
// //     user.findOne({"local.username":req.param('username')}, function(err, theUser){
// //         if (err) {
// //             res.send(err);
// //         }
// //         if (!theUser) {
// //             res.send('There is no account for this username.');
// //         }
// //         else {
// //             res.json(theUser);
// //         }
// //
// //     });
// // });
//
// router.get('/:username', function(req, res, next){
//     user.findOne({"username":req.params.username}, function(err, theUser){
//         if (err) {
//             res.send(err);
//         }
//         if (!theUser) {
//             res.send('There is no account for this username.');
//         }
//         else {
//             res.json(theUser);
//         }
//
//     });
// });
//
// router.put('/:username', function(req,res, next){
//     var user_name = req.params.username;
//     if (req.body.firstName) {
//         var first = req.body.firstName;
//         user.findOneAndUpdate({ "local.username":user_name }, { firstName:first }, function(err, theUser){
//             if (err) {
//                 res.send(err);
//             }
//             else {
//                 console.log(theUser);
//             }
//         });
//     }
//     if (req.body.lastName) {
//         var last = req.body.lastName;
//         user.findOneAndUpdate({ 'local.username':user_name }, { lastName:last }, function(err, theUser){
//             if (err) {
//                 res.send(err);
//             }
//             else {
//                 console.log(theUser);
//             }
//         });
//     }
//     if (req.body.password) {
//         var pass = req.body.password;
//         user.findOneAndUpdate({ 'local.username':user_name }, { password:pass }, function(err, theUser){
//             if (err) {
//                 res.send(err);
//             }
//             else {
//                 console.log(theUser);
//             }
//         });
//     }
//     res.send("user update.")
// });
//
// //  have no clear idea what post should do
// router.delete('/:username', function(req, res, next){
//     user.findOne({"local.username":req.params.username}, function(err, theUser){
//         if (err) {
//             res.send(err);
//         }
//         if (!theUser) {
//             res.send('There is no account for this username.');
//         }
//         else {
//             theUser.remove(function(err) {
//                 if (err) {
//                     res.send(err);
//                 }
//                 else {
//                     res.send("user delete.");
//                 }
//             });
//         }
//     });
// });
//
// router.delete('/:username/:groupid', function(req, res, next){
//     user.findOne({"local.username":req.params.username}, function(err, theUser){
//         if (err) {
//             res.send(err);
//         }
//         if (!theUser) {
//             res.send('There is no account for this username.');
//         }
//         else {
//             group.findOne({"groupName":req.params.groupid}, function(err, theGroup) {
//                 if (err) {
//                     res.send(err);
//                 }
//                 if (!theGroup) {
//                     res.send('There exists no group for this groupid.');
//                 }
//                 else {
//                     var mems = theGroup.members;
//                     var i = mems.indexOf(req.params.username);
//                     if (i != -1) {
//                         mems.splice(i, 1);
//                     }
//                     theGroup.members = mems;
//                     theGroup.save(function(err, newGroup){
//                         if (err) {
//                             res.send(err);
//                         }
//                         else {
//                             res.json(newGroup);
//                         }
//                     });
//                 }
//             });
//         }
//     });
// });

// router.delete

function validateAlphabetNumeric(s){
    if( /[^a-zA-Z0-9]/.test( s ) ) {
        return false;
    }
    return true;     
}

function validateAlphabet(s){
    if( /[^a-zA-Z]/.test( s ) ) {
        return false;
    }
    return true;     
}

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
// module.exports = router;
