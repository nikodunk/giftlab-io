var express = require('express');
var router = express.Router();
var paypal = require('paypal-rest-sdk');

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': process.env.PAYPAL_ID,
  'client_secret': process.env.PAYPAL_CLIENT_SECRET
});



router.post('/submit', (req, res) => {
  let description = req.body.description ? req.body.description : 'This is the payment description'
  let amount = req.body.amount
  let host = req.protocol + '://' + req.get('host')
  let createPaymentJson = {
    intent: "sale", // authorize
    payer: {
      payment_method: "paypal"
    },
    redirect_urls: {
      return_url: host + '/paypal/payment-return',
      cancel_url: host + '/paypal/payment-cancel'
    },
    transactions: [{
      item_list: {
        items: [{
          name: "Donation",
          sku: "item_1",
          price: amount,
          currency: "USD",
          quantity: 1
        }]
      },
      amount: {
        currency: "USD",
        total: amount
      },
      payee: {
            email: 'info@seaturtles.org'
        },
      description: 'Your donation to this location'
    }]
  }
  // Call PayPal to process the payment
  paypal.payment.create(createPaymentJson, (err, payment) => {
    if (err) {
      console.log(err.response.error_description)
      throw err
    } else {
      console.log("Create Payment response...")
      console.log(payment)
      let redirectUrl
      payment.links.forEach((link) => {
        if (link.method === 'REDIRECT') {
          redirectUrl = link.href
        }
      })
      if (redirectUrl) {
        res.status(200).redirect(redirectUrl)
      } else {
        logger.error('Cannot find redirect url from paypal payment result!')
      }
    }
  })
})

router.get('/payment-return', function(req, res, next) {
  res.render('thanks'
            );
});


module.exports = router;