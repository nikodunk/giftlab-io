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



  router.get('/charge/', (req, res) => {
    let token = request.body.stripeToken;
    console.assert(token)
    const amount = CHARGE_AMOUNT * 100
    stripe.charges.create({
      amount: amount,
      currency: 'usd',
      source: token,
      description: 'Stripe experiment testing charge'
    }, (err, charge) => {
      if (err) {
        res.redirect('/stripe/payment-failure?err_msg=' + err.message)
      } else {
        console.log('charge', charge)
        if (charge.outcome && charge.outcome.risk_level != 'normal') {
          res.redirect('/stripe/payment-warning?charge_id=' + charge.id + '&msg=' + charge.outcome.seller_message)
        } else {
          res.redirect('/stripe/payment-success/' + charge.id)
        }
      }
    })
  })

  router.post('/charge', (req, res) => {
    let token = req.body.stripeToken
    console.assert(token)
    const amount = CHARGE_AMOUNT * 100
    stripe.charges.create({
      amount: amount,
      currency: 'usd',
      source: token,
      description: 'Stripe experiment testing charge'
    }, (err, charge) => {
      if (err) {
        res.redirect('/stripe/payment-failure?err_msg=' + err.message)
      } else {
        console.log('Charged successful')
        console.log('charge', charge)
        res.redirect('/stripe/payment-success/' + charge.id)
      }
    })
  })


module.exports = router;