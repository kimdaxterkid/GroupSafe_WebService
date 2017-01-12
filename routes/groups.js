/**
 * Created by sungh on 10/2/2016.
 */
/**
 * Created by Sungha on 5/20/2016.
 */
var express = require('express');
var bodyParser = require('body-parser');
var group = require('../models/groups');
var user = require('../models/users');

// Use body parser to parse json
// If the body of the incoming request message contains data in json,
// then parse that and convert it to json object

var groupRouter = express.Router();
groupRouter.use(bodyParser.json());
groupRouter.use(bodyParser.json({type: 'application/vnd.api+json' } )); // parse aplication/vnd.api+json as json

groupRouter.route('/')
    .all(function(req, res, next) {
        // res.writeHead(200, {"Content-Type": "application/json"});
        // if you want to continue the rest of the middleware, then call next
        // This means that the parsing should continue
        next();
    })
    .get(function(req, res, next) {
        group.find(function(err, groups) {
            // if there is an error retrieving, send the error. nothing after res.send(err)
            if (err) res.send(err);
            console.log(groups);
            res.json(groups); // return all todos in JSON format
        });
    })
    .post(function(req, res, next) {
        // Check if it already exists
        group.findOne({"groupName": req.body.groupName}, function (err, aGroup) {
            // if it doesn't exist
            if (err) {
                console.log(err);
                res.send(err);
            }
            if(!aGroup) {
                user.findOne({ "local.username" : req.body.host }, function (err, aUser) {
                    if (!aUser) {
			            console.log('Could not find username' + req.body.host);
                        res.send(403);
			//res.send('Could not find username ' + req.body.host);
                    }
                    else {
                        console.log("HOST USER: " + aUser);
                        group.create({
                            groupName: req.body.groupName,
                            // members: req.body.members,
                            members : [{"username" : aUser.local.username, "firstName" : aUser.local.firstName, "lastName" : aUser.local.lastName, phoneNumber : aUser.local.phoneNumber}], // better to save ids of people?
                            range: req.body.range,
                            // Find the user in the userDB. Maybe not necessary if the person is already in it..
                            host : aUser.local.username
                        }, function (err, groups) {
                            if (err) {
                                console.log("error creating a group: " + err);
                                res.send(err);
                            }
                            group.findOne({"groupName" : req.body.groupName}, function (err, groups) {
                            if (err) res.send(err);
                            res.json(groups);
                            });
                        });
                    }
                });
            }
            else {
                console.log("The group name " + req.body.groupName + " already exists. Please pick another name");
                res.send(403);
		//res.send("The group name " + req.body.groupName + " already exists. Please pick another name");
            }
        });

    }
    );

/**
 * To test this, use post man with below in the body as JSON format
 *  {
 *   "name":"Sungha",
 *   "description":"Some detailed description"
 *  }
 */
groupRouter.route("/:groupId")
    .all(function(req, res, next) {
        // res.writeHead(200, {"Content-Type": "text/plain"});
        // if you want to continue the rest of the middleware, then call next
        // This means that the parsing should continue
        next();
    })
    .get(function(req, res, next) {
        group.find({"groupName" : req.params.groupId}, function(err, aGroup) {
            if (err) res.send(err);
            res.json(aGroup);
        });
    })
    .put(function(req, res, next) {
        group.findOne({"groupName": req.params.groupId}, function (err, aGroup) {
            if (err) res.send(err);

            if (!aGroup) {
                console.log("Could not find the group.");
                res.send(404);
            }
            // trying to change the host
            if (req.body.host) {
                console.log("body.host " + req.body.host);
                user.findOne({ 'local.username' : req.body.host }, function (err, aUser) {
                    if (err) {
                        console.log("Error trying to change the host" + err);
                        res.send(err);
                    }
                    else if (!aUser) {
                        console.log("Could not find a user to promote as a host");
                        res.send(404);
                    }
                    // else if (aGroup.members.indexOf(aUser.local.username) < 0) {
                    else if (!isMemberInGroup(aUser.local.username, aGroup.members)) {
                        console.log("User is not in the group");
                        res.send(404);
                    }
                    else {
                        aGroup.host = aUser.local.username;
                        aGroup.save(function (err) {
                            if (err) {
                                console.log("Could not save the new host");
                                res.send(401);
                            }
                            else {
                                console.log(aGroup.host + " is now the host of the group " + aGroup.groupName);
                                res.json(aGroup);
                            }
                        });
                    }
                })
            }
            else
            {
                console.log("Trying to add a group member " + req.body.members);
                user.findOne({"local.username": req.body.members}, function (err, aUser) {
                    if (err) {
                        console.log("Error finding a user trying to add to a group");
                        res.send(err);
                    }
                    if (!aUser) {
                        console.log("Could not find a user to add to the group");
                        res.send(404);
                    }
                    else if (isMemberInGroup(aUser.local.username, aGroup.members)) {
                        console.log("Member " + aUser.local.username + " is already in the group");
                        res.send(401);
                    }
                    else {
                        // aGroup.members = aGroup.members.concat(req.body.members);
                        aGroup.members = aGroup.members.concat({"username" : aUser.local.username, "firstName" : aUser.local.firstName, "lastName" : aUser.local.lastName, phoneNumber : aUser.local.phoneNumber});
                        aGroup.save(function (err) {
                            if (err) {
                                console.log("Could not save new members to the group");
                                res.send(err);
                            }
                            else {
                                console.log("Members " + req.body.members + " have been added");
                                res.json(aGroup);
                            }
                        });
                    }
                });
            }
        });
    })
    .delete(function(req, res, next) {
        //Maybe try group.findOneAndUpdate();
        // localhost:3000/deleteUserFromGroup/GroupName?members=username
        group.findOne({"groupName" : req.params.groupId}, function(err, aGroup) {
            if (isEmpty(req.query)) {
                //delete the group
                console.log("Deleting the group")
                console.log(req.query);
                aGroup.remove({_id: aGroup._id}, function(err, result) {
                    if (err) console.log("Failed to delete the group: " + err);
                    console.log(result);
                })
                res.json(aGroup);
            }
            else {
                var person = req.query.members;
                var index = -1;
                var count = 0;
                if (aGroup) {
                    aGroup.members.forEach(function (element) {
                        if (element.username === person) {
                            index = count; // no break possible
                        }
                        count = count + 1;
                    })
                    // var index = aGroup.members.indexOf(person);
                    if (index > -1) {
                        if (aGroup.members.length == 1) {
                            aGroup.remove({_id: aGroup._id}, function (err, result) {
                                if (err) console.log("Failed to delete the group: " + err);
                                console.log(result);
                            });
                        }
                        else {
                            aGroup.members.splice(index, 1);
                            aGroup.save(function (err) {
                                if (err) console.log("Could not remove the person " + person + " from the group: " + err);
                                else {
                                    console.log("Removed the person: " + person);
                                    //deleteUser(person, aGroup.groupName);
                                }
                            })
                        }
                        res.json(aGroup);
                    }
                    else {
                        console.log("The person " + person + " is not in the group");
                        res.json(aGroup);
                    }
                }
            }
        })
    }
    );

/**
 *
 */
function isMemberInGroup(member, groupMembers) {
    for (var i = 0; i < groupMembers.length; i++) {
        if (groupMembers[i].username === member) return true;
    }
    return false;
}
/**
 * This completes the groupRouter to redirect all the URL with dishes to the function above
 */
function isEmpty(obj) {
    if (obj == null) return true;

    if (obj.length && obj.length > 0) return false;
    if (obj.length === 0) return true;
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}


module.exports = groupRouter;



function deleteUser (name, groupName) {
    var thePath = '/deleteUserFromGroup?groupName='+ groupName + '&members=' + name;
    console.log(thePath);
    var http = require('http');
    var options = {
        host: 'ec2-54-158-251-62.compute-1.amazonaws.com',
        port: "3000",
        path: thePath,
        method: 'delete',
    };

    var req = http.request(options, function(res) {
            console.log('STATUS: ${res.statusCode}');
            console.log('HEADERS: ${JSON.stringify(res.headers)}');
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                console.log('BODY: ${chunk}');
            });
            res.on('end', function() {
                console.log('No more data in response.');
            });
    });

    req.on('error', function(e) {
        console.log('problem with request: ${e.message}');
    });
    req.end();
}