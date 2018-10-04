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
  // mixpanel.track('homepage_loaded');
});

router.get('/about', function(req, res, next) {
  // visitor.pageview("/about", "http://giftlab.io", "Welcome").send();
  res.render('about');
  // mixpanel.track('about_loaded');
});


router.get('/contact', function(req, res, next) {
  res.render('contact');
  // mixpanel.track('contact_loaded');
});




router.post( '/signup', function (req, result) {
  console.log(req.body.email)
  client.query(`INSERT INTO marketing VALUES ('`+req.body.email+`');`); 
  //mixpanel.track('signup_clicked');
  // client.query(`SELECT * FROM marketing WHERE email = '`+req.body.email+`';`, (err, res) => {
 //      if (err) throw err;
 //      console.log(res)
 //      console.log(res.rows.length)
 //      if (res.rows.length === 0){ 
 //        console.log('doesnt exist')
 //        client.query(`INSERT INTO marketing VALUES ('`+req.body.email+`');`); 
 //      }
 //      // IF THE ACCOUNT EXISTS ALREADY DO NOTHING AND RESPOND
 //      else{
 //          console.log('exists')
 //      }
 //      client.end();
 //  }); 
  result.send('done')
})




module.exports = router;