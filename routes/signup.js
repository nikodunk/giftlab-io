var express = require('express');
var router = express.Router();
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();


router.get('/', function(req, res, next) {
    res.render('signup');
});


router.get('/success/'+'\\\?'+'scope=read_write&code=:authcode', function(req, res, next) {
    console.log('THIS IS THE AUTH CODE: ----> '+req.params.authcode)
    res.render('signup_success');
});




module.exports = router;