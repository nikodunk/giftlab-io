var express = require('express');
var router = express.Router();
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

// See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")("sk_test_4eC39HqLyjWDarjtT1zdp7dc");


  // Set up the payment:
  // 1. Set up a URL to handle requests from the PayPal button
  router.post('/create-payment/:sku/:amount/', function(req, res){

    
  
    stripe.charges.create({
      amount: 1000,
      currency: "usd",
      source: "tok_visa",
      destination: {
                account: "{CONNECTED_STRIPE_ACCOUNT_ID}",
              },
    }).then(function(charge) {
      // asynchronously called

    });


  })

  // Execute the payment:
  // 1. Set up a URL to handle requests from the PayPal button.
  router.post('/execute-payment/:sku/:amount/', function(req, res) {

  
  })


module.exports = router;