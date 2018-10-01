var express = require('express');
var router = express.Router();
var http = require('http');


const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();


router.get('/', function(req, res, next) {
    res.render('signup');
});


router.get('/success/', function(req, res, next) {
    console.log('THIS IS THE AUTH CODE: ----> '+ req.query.code)


    // curl https://connect.stripe.com/oauth/token \
    //    -d client_secret=sk_test_FufIvJxq2f94m1QAt1T12wMR \
    //    -d code="{AUTHORIZATION_CODE}" \
    //    -d grant_type=authorization_code

    // client.query(`INSERT INTO marketing VALUES ('`+req.body.email+`');`); 
    res.render('signup_success');
});




module.exports = router;