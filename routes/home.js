var express = require('express');
var router = express.Router();
var content = require('../public/javascripts/content.json')
var giftlists = require('../public/javascripts/giftlists.json')
var links = require('../public/javascripts/links.json')

const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { 
                content: content,
                giftlist: giftlists,
                links: links
              });
});

router.get('/about', function(req, res, next) {
  res.render('about');
});


router.get('/contact', function(req, res, next) {
  res.render('contact');
});



router.post( '/signup', function (req, res) {
	client.query(`INSERT INTO marketing VALUES ('`+req.body.email+`');`, (err, res) => {
      if (err) throw err;
      client.end();
  });	
  res.send('added')
})




module.exports = router;