var express = require('express');
var router = express.Router();
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

var request = require('request');




router.get('/', function(req, res, next) {
    res.render('signup');
});



router.get('/success/', function(req, res, next) {
    console.log('THIS IS THE AUTH CODE: ----> '+ req.query.code)
    
    request.post( 'https://connect.stripe.com/oauth/token', {
	    	json: { 
	        	client_secret: 'sk_test_FufIvJxq2f94m1QAt1T12wMR', 
	        	code: req.query.code, 
	        	grant_type: 'authorization_code'  
	        }
    	},
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
                // client.query(`INSERT INTO stripe_codes VALUES ('`+body.stripe_user_id+`');`); 
            }
        }
    );

    // request.post({
    //   url: 'https://connect.stripe.com/oauth/deauthorize',
    //   formData: {
    //     client_id: 'ca_Dcj8reHZ6xjlEBfDVn4Zl07ergfiWVCG',
    //     stripe_user_id: 'acct_m8CpCJwOdqmHKu',
    //   },
    //   headers: {'Authorization': 'Bearer sk_test_FufIvJxq2f94m1QAt1T12wMR'},
    // });


    // curl https://connect.stripe.com/oauth/token \
    //    -d client_secret=sk_test_FufIvJxq2f94m1QAt1T12wMR \
    //    -d code="{AUTHORIZATION_CODE}" \
    //    -d grant_type=authorization_code

    // client.query(`INSERT INTO marketing VALUES ('`+req.body.email+`');`); 


    res.render('signup_success');
});




module.exports = router;