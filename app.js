var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var homeRouter = require('./routes/home');
var projectsRouter = require('./routes/projects');
var paypalRouter = require('./routes/paypal');

const expressGa = require('express-ga-middleware');


// var expressGoogleAnalytics = require('express-google-analytics');
// var analytics = expressGoogleAnalytics('UA-121905544-1');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(analytics);
app.use(expressGa('UA-121905544-1'));

app.use('/', homeRouter);
app.use('/projects', projectsRouter);
app.use('/paypal', paypalRouter);

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
