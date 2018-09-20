var express = require('express');
var router = express.Router();
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

// See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")("sk_test_FufIvJxq2f94m1QAt1T12wMR");


  router.post('/charge/:sku/', (req, res) => {
    let token = req.body.stripeToken
    console.assert(token)

    stripe.charges.create({
      amount: 12,
      currency: 'usd',
      source: token,
      description: 'Stripe experiment testing charge'
    }, (err, charge) => {
      if (err) { res.redirect('/stripe/payment-failure?err_msg=' + err.message) } 

      else {
        console.log('Charged successful')
        console.log('charge', charge)
        console.log('SAVE TO DATABASE:' + req.params.sku, charge.amount, charge.source.name)
        // res.redirect('/payment/payment-success/' + charge.id)
        mixpanel.track('stripe completed');
      }
    })
  })


module.exports = router;