var express = require('express');
var router = express.Router();
var content = require('../public/javascripts/content.json')
var giftlists = require('../public/javascripts/giftlists.json')
var links = require('../public/javascripts/links.json')
var pg = require('pg');


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
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query(`INSERT INTO marketing VALUES ('`+req.body.email+`');`)
		done();
		res.send( 'added' )
	})	
})


module.exports = router;