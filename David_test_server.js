	//	Require modules from the npm dependency.
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             			// log requests to the console (express4)
    var bodyParser = require('body-parser');    			// pull information from HTML POST (express4)
    var methodOverride = require('method-override'); 		// simulate DELETE and PUT (express4)

    // configuration =================
    app.use(express.static(__dirname + '/public'));                     // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                             // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));                // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                         // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' }));     // parse application/vnd.api+json as json
    app.use(methodOverride());
    
    mongoose.connect('mongodb://localhost/users');
    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    var userSchema = new mongoose.Schema({
        account:String, 
        password:String
        }, 
        {collection: "users"}
    );
    var User = mongoose.model('users', userSchema);
    db.once('open', function() {
        console.log('mongoose opened!');
        User.findOne({account:"david"}, function(err, doc){
            if(err) {
                console.log(err);
            }
            else if (!doc) {
                console.log("No account find.");
            }
            else {
                console.log("account: " + doc.account + " password: " + doc.password);
            }
        });

    });

    app.get("/", function(req, res){
        res.send("hello");
    });

    app.post("/createUser", function(req, res){
        var user_account = req.param('account');
        var user_password = req.param('password');
        console.log(user_account);
        console.log(user_password);        
        var newUser = new User({account:user_account, password:user_password});
        newUser.save(function(err, doc){
            if (err) {
                console.log(err);
            }
            else {
                console.log(doc.account + ' saved');
            }
        });
        res.send("Create the user.");  
    });

    // listen (start app with node server.js) ======================================
    app.listen(8080);
    console.log("App listening on port 8080");