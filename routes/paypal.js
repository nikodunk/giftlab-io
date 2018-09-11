var express = require('express');
var router = express.Router();
var paypal = require('paypal-rest-sdk');
var pg = require('pg');

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': process.env.PAYPAL_ID,
  'client_secret': process.env.PAYPAL_CLIENT_SECRET
});



router.post('/submit', (req, res) => {
  let description = req.body.description ? req.body.description : 'This is the payment description'
  let amount = req.body.amount
  // let host = req.protocol + '://' + req.get('host')
  var create_payment_json = {
      "intent": "sale",
      "payer": {
          "payment_method": "paypal"
      },
      "redirect_urls": {
          "return_url": "http://return.com",
          "cancel_url": "http://cancel.com"
      },
      "transactions": [{
          "item_list": {
              "items": [{
                  "name": "item",
                  "sku": "item",
                  "price": "1.00",
                  "currency": "USD",
                  "quantity": 1
              }]
          },
          "amount": {
              "currency": "USD",
              "total": "1.00"
          },
          "description": "This is the payment description."
      }]
  };

  // SAVE TO DATABASE
    // create orderID = 'timestamp'
    // client.query(`INSERT INTO orders VALUES ('`+req.body.amount+`,`+req.body.sku+`');`, (err, res) => {
    //     }
    //     client.end();
    // });

  // Call PayPal to process the payment
  paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
          throw error;
      } else {
          console.log("Create Payment Response");
          console.log(payment);
      }
  });

})

router.get('/payment-return', function(req, res, next) {
  res.render('thanks')
});


module.exports = router;