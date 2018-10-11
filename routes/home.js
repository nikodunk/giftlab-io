var express = require('express');
var router = express.Router();
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

var content = require('../public/javascripts/content.json')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { content: content.slice(0).reverse(), meta: content[0].image, title: 'Giftlab' });
});

/* GET about page. */
router.get('/about', function(req, res, next) {
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