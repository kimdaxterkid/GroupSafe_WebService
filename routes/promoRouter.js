/**
 * Created by Sungha on 5/23/2016.
 */
var express = require('express');
var bodyParser = require('body-parser');
var promoRouter = express.Router();
//groupRouter will not support json format
promoRouter.use(bodyParser.json());


promoRouter.route('/')
    .all(function(req, res, next) {
        res.writeHead(200, {"Content-Type": "text/plain"});
        // if you want to continue the rest of the middleware, then call next
        // This means that the parsing should continue
        next();
    })
    .get(function(req, res, next) {
        res.end("Will send all the promotions to you!");
    })
    .post(function(req, res, next) {
        res.end("Will add the promotions: " + req.body.name + " with details: " + req.body.description);
    })
    .delete(function(req, res, next) {
        res.end("Deleting all promotions");
    });

promoRouter.route("/:leaderId")
    .all(function(req, res, next) {
        res.writeHead(200, {"Content-Type": "text/plain"});
        // if you want to continue the rest of the middleware, then call next
        // This means that the parsing should continue
        next();
    })
    .get(function(req, res, next) {
        res.end("Will send details of the promotion: " + req.params.leaderId + " to you!");
    })
    .put(function(req, res, next) {
        res.write("Updating the promotion: " + req.params.leaderId + "\n");
        res.end("Will update the promotion: " + req.body.name + " with details: " + req.body.description);
    })
    .delete(function(req, res, next) {
        res.end("Deleting promotion: " + req.params.leaderId);
    });

module.exports = promoRouter;