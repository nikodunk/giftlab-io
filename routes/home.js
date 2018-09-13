var express = require('express');
var router = express.Router();
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

var content = require('../public/javascripts/content.json')
var skus = require('../public/javascripts/skus.json')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { 
                content: content,
                skus: skus
              });
});

router.get('/about', function(req, res, next) {
  res.render('about');
});


router.get('/contact', function(req, res, next) {
  res.render('contact');
});

router.get('/home_success', function(req, res, next) {
  res.render('home_success', { 
                content: content,
                skus: skus
              });
});

router.get('/thanks/', function(req, res, next) {
  res.render('thanks')
});

router.post( '/signup', function (req, result) {
	client.query(`SELECT * FROM marketing WHERE email = '`+req.body.email+`';`, (err, res) => {
      //if (err) throw err;
      console.log(res.rows.length)
      if (res.rows.length === 0){ 
        console.log('doesnt exist')
        client.query(`INSERT INTO marketing VALUES ('`+req.body.email+`');`, (err, res) => {}); 
      }
      // IF THE ACCOUNT EXISTS ALREADY DO NOTHING AND RESPOND
      else{
          console.log('exists')
      }
      client.end();
  }); 
  result.redirect('/home_success#signup');
})




module.exports = router;