/**
 * Created by Sungha on 5/20/2016.
 */
var express = require('express');
var bodyParser = require('body-parser');
// Use body parser to parse json
// If the body of the incoming request message contains data in json,
// then parse that and convert it to json object
/**
 * express.Router() allows you to do everything in server-3.js but shorter
 * you do not need to specify /dishes each time after setting it once decreasing
 * possible errors.
 */
var dishRouter = express.Router();
//groupRouter will not support json format
dishRouter.use(bodyParser.json());
/**
 * doing / will router all the dishes to /
 */
dishRouter.route('/')
    .all(function(req, res, next) {
        res.writeHead(200, {"Content-Type": "text/plain"});
        // if you want to continue the rest of the middleware, then call next
        // This means that the parsing should continue
        next();
    })
    .get(function(req, res, next) {
        res.end("Will send all the dishes to you!");
    })
    .post(function(req, res, next) {
        res.end("Will add the dish: " + req.body.name + " with details: " + req.body.description);
    })
    .delete(function(req, res, next) {
        res.end("Deleting all dishes");
    });

/**
 * To test this, use post man with below in the body as JSON format
 *  {
 *   "name":"Sungha",
 *   "description":"Some detailed description"
 *  }
 */
dishRouter.route("/:dishId")
    .all(function(req, res, next) {
        res.writeHead(200, {"Content-Type": "text/plain"});
        // if you want to continue the rest of the middleware, then call next
        // This means that the parsing should continue
        next();
    })
    .get(function(req, res, next) {
        res.end("Will send details of the dish: " + req.params.dishId + " to you!");
    })
    .put(function(req, res, next) {
    res.write("Updating the dish: " + req.params.dishId + "\n");
    res.end("Will update the dish: " + req.body.name + " with details: " + req.body.description);
    })
    .delete(function(req, res, next) {
        res.end("Deleting dish: " + req.params.dishId);
    });
/**
 * This completes the groupRouter to redirect all the URL with dishes to the function above
 */

module.exports = dishRouter;
