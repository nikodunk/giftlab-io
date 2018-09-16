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
  res.render('home', { 
                content: content
              });
});

router.get('/about', function(req, res, next) {
  res.render('about');
});


router.get('/contact', function(req, res, next) {
  res.render('contact');
});



router.get('/.well-known/acme-challenge/jxvKfAiNHcyEsrIl8ArTE4OOLFneo4coRc6VqkNYvvo', (req, res)=>{
 res.send('jxvKfAiNHcyEsrIl8ArTE4OOLFneo4coRc6VqkNYvvo.XnHIB3tAEZqwZCdaZIqn6YtQlH_dDr4Jh8N68fy_sXA');
})



router.post( '/signup', function (req, result) {
  console.log(req.body.email)
  client.query(`INSERT INTO marketing VALUES ('`+req.body.email+`');`); 
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