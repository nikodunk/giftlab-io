var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var homeRouter = require('./routes/home');
var projectsRouter = require('./routes/projects');
var paymentRouter = require('./routes/payment');
var signupRouter = require('./routes/signup');


var app = express();

// var redirectToHTTPS = require('express-http-to-https').redirectToHTTPS


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));


app.use('/', homeRouter);
app.use('/projects', projectsRouter);
app.use('/payment', paymentRouter);
app.use('/signup', signupRouter);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
