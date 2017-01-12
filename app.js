var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash    = require('connect-flash');
var session      = require('express-session');
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var mongoose = require('mongoose');
//TODO Change when deploying

 var mongoURL = 'mongodb://vtgroupsafe:123@ec2-54-158-251-62.compute-1.amazonaws.com:27017/dummyDB';
//var mongoURL = 'mongodb://localhost:27017/sung';
mongoose.connect(mongoURL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection error: '));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.set('view engine', 'ejs'); // set up ejs for templating

// Set up for passport
require('./config/passport')(passport); // pass passport for configuration



var hostname = 'ec2-54-158-251-62.compute-1.amazonaws.com';
//var hostname = 'localhost';
var port = 8080;



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(morgan('dev')); // log every request to console
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json' } )); // parse aplication/vnd.api+json as json
app.use(bodyParser.urlencoded({'extended' : 'true'})); //parse application/x-www-form-urlencoded
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride());

// required for passport
app.use(session({
  secret: 'ilovescotchscotchyscotchscotch', // session secret
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Set up routes
var routes = require('./routes/index')(app, passport);
var users = require('./routes/users.js')(app, passport);
var dishes = require('./routes/dishes');
var leaders = require('./routes/leaderRouter');
var promotion = require('./routes/promoRouter');
var groups = require('./routes/groups');

// Set up routes for each modules
// app.use('/', routes);
// app.use('/users', users);
app.use('/dishes', dishes);
app.use('/leaders', leaders);
app.use('/promotions', promotion);
app.use('/groups', groups);
app.get("/hello", function(req, res){
    res.send("hello");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


app.listen(port, hostname, function() {
  console.log('Server running at http://${hostname}:${port}/');
});