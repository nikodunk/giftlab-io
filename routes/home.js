var express = require('express');
var router = express.Router();
var content = require('../public/javascripts/content.json')
var giftlists = require('../public/javascripts/giftlists.json')
var links = require('../public/javascripts/links.json')
var $ = jQuery = require('jquery')

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



router.post( '/signup', function (req, result) {
	client.query(`SELECT * FROM marketing WHERE email = '`+req.body.email+`';`, (err, res) => {
      //if (err) throw err;
      console.log(res.rows.length)
      if (res.rows.length === 0){ 
        console.log('doesnt exist')
        client.query(`INSERT INTO marketing VALUES ('`+req.body.email+`');`, (err, res) => {}); 
            result.render('home', { 
                  content: content,
                  giftlist: giftlists,
                  links: links
                });
      }
      // IF THE ACCOUNT EXISTS ALREADY DO NOTHING AND RESPOND
        else{
            console.log('does exist')
            result.render('home', { 
                  content: content,
                  giftlist: giftlists,
                  links: links
                });
        }
      client.end();
  }); 
})




module.exports = router;