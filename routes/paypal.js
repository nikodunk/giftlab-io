var express = require('express');
var router = express.Router();
var paypal = require('paypal-rest-sdk');
var pg = require('pg');

// paypal.configure({
//   'mode': 'sandbox', //sandbox or live
//   'client_id': process.env.PAYPAL_ID,
//   'client_secret': process.env.PAYPAL_CLIENT_SECRET
// });


const CLIENT = process.env.PAYPAL_ID
const SECRET = process.env.PAYPAL_CLIENT_SECRET
const PAYPAL_API = 'https://api.sandbox.paypal.com';


router.post('/create-payment/', function(req, res)
  {
    // 2. Call /v1/payments/payment to set up the payment
    request.post(PAYPAL_API + '/v1/payments/payment',
    {
      auth:
      {
        user: CLIENT,
        pass: SECRET
      },
      body:
      {
        intent: 'sale',
        payer:
        {
          payment_method: 'paypal'
        },
        transactions: [
        {
          amount:
          {
            total: '5.99',
            currency: 'USD'
          }
        }],
        redirect_urls:
        {
          return_url: 'https://www.mysite.com',
          cancel_url: 'https://www.mysite.com'
        }
      },
      json: true
    }, function(err, response)
    {
      if (err)
      {
        console.error(err);
        return res.sendStatus(500);
      }
      // 3. Return the payment ID to the client
      res.json(
      {
        id: response.body.id
      });
    });
  })
  // Execute the payment:
  // 1. Set up a URL to handle requests from the PayPal button.
  .post('/execute-payment/', function(req, res)
  {
    // 2. Get the payment ID and the payer ID from the request body.
    var paymentID = req.body.paymentID;
    var payerID = req.body.payerID;
    // 3. Call /v1/payments/payment/PAY-XXX/execute to finalize the payment.
    request.post(PAYPAL_API + '/v1/payments/payment/' + paymentID +
      '/execute',
      {
        auth:
        {
          user: CLIENT,
          pass: SECRET
        },
        body:
        {
          payer_id: payerID,
          transactions: [
          {
            amount:
            {
              total: '10.99',
              currency: 'USD'
            }
          }]
        },
        json: true
      },
      function(err, response)
      {
        if (err)
        {
          console.error(err);
          return res.sendStatus(500);
        }
        // 4. Return a success response to the client
        res.json(
        {
          status: 'success'
        });
      });
  })


// router.post('/submit', (req, res) => {
//   let description = req.body.description ? req.body.description : 'This is the payment description'
//   let amount = req.body.amount
//   let host = req.protocol + '://' + req.get('host')
//   let createPaymentJson = {
//     intent: "sale", // authorize
//     payer: {
//       payment_method: "paypal"
//     },
//     redirect_urls: {
//       return_url: host + '/paypal/payment-return',
//       cancel_url: host + '/paypal/payment-cancel'
//     },
//     transactions: [{
//       item_list: {
//         items: [{
//           name: "Donation",
//           sku: "d1",
//           price: amount,
//           currency: "USD",
//           quantity: 1
//         }]
//       },
//       amount: {
//         currency: "USD",
//         total: amount
//       },
//       payee: {
//             email: 'info@seaturtles.org'
//         },
//       description: 'Your donation to this location'
//     }]
//   }

//   // SAVE TO DATABASE
//     // create orderID = 'timestamp'
//     // client.query(`INSERT INTO orders VALUES ('`+req.body.amount+`,`+req.body.sku+`');`, (err, res) => {
//     //     }
//     //     client.end();
//     // });

//   // Call PayPal to process the payment
//   paypal.payment.create(createPaymentJson, (err, payment) => {
//     if (err) {
//       console.log(err.response.error_description)
//       throw err
//     } else {
//       console.log("Create Payment response...")
//       console.log(payment)
//       let redirectUrl
//       payment.links.forEach((link) => {
//         if (link.method === 'REDIRECT') {
//           redirectUrl = link.href
//         }
//       })
//       if (redirectUrl) {
//         res.status(200).redirect(redirectUrl)
//       } else {
//         logger.error('Cannot find redirect url from paypal payment result!')
//       }
//     }
//    })

// })

// router.get('/payment-return', function(req, res, next) {
//   res.render('thanks')
// });


module.exports = router;