var express = require('express');
var router = express.Router();
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

// var Mixpanel = require('mixpanel');
// var mixpanel = Mixpanel.init('bba2c237fccc04b19cec51dee15cf123');

var content = require('../public/javascripts/content.json')






/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { content: content });
});

/* GET about page. */
router.get('/about', function(req, res, next) {
  // visitor.pageview("/about", "http://giftlab.io", "Welcome").send();
  res.render('about');
});

/* GET contact page. */
router.get('/contact', function(req, res, next) {
  res.render('contact');
});

/* POST to save new email to postgres. */
router.post( '/email', function (req, result) {
  console.log(req.body.email)
  client.query(`INSERT INTO marketing VALUES ('`+req.body.email+`');`); 
  result.send('done')
})




module.exports = router;