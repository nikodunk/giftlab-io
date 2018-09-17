var express = require('express');
var router = express.Router();
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

var paypal = require('paypal-rest-sdk');
var request = require('request');

// var Mixpanel = require('mixpanel');
// var mixpanel = Mixpanel.init('bba2c237fccc04b19cec51dee15cf123');


var PAYPAL_ID =  process.env.PAYPAL_ID;
   // 'AUJoKVGO3q1WA1tGgAKRdY6qx0qQNIQ6vl6D3k7y64T4qh5WozIQ7V3dl3iusw5BwXYg_T5FzLCRguP8';
var PAYPAL_CLIENT_SECRET =  process.env.PAYPAL_CLIENT_SECRET
    // 'EOw8LNwDhM7esrQ3nHfzKc7xiWnJc83Eawln4YLfUgivfx1LGzu9Mj0F5wlarilXDqdK9Q5aHVo-VGjJ';
var PAYPAL_API = 'https://api.paypal.com';




  // Set up the payment:
  // 1. Set up a URL to handle requests from the PayPal button
  router.post('/create-payment/:sku/:amount/', function(req, res){

    // mixpanel.track('paypal_clicked');
    // 2. Call /v1/payments/payment to set up the payment
    request.post(PAYPAL_API + '/v1/payments/payment',
    {
      auth:
      {
        user: PAYPAL_ID,
        pass: PAYPAL_CLIENT_SECRET
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
            total: req.params.amount,
            currency: 'USD'
          },
          payee: {
                  email: 'info@seaturtles.org'
              },
        }],
        redirect_urls:
        {
          return_url: 'https://placeholder.com',
          cancel_url: 'https://placeholder.com'
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
      // console.log(response.body)
      res.json(
      {
        id: response.body.id
      });
    });
  })



  // Execute the payment:
  // 1. Set up a URL to handle requests from the PayPal button.
  router.post('/execute-payment/:sku/:amount/', function(req, res) {

    // 2. Get the payment ID and the payer ID from the request body.
    var paymentID = req.body.paymentID;
    var payerID = req.body.payerID;
    // 3. Call /v1/payments/payment/PAY-XXX/execute to finalize the payment.
    request.post(PAYPAL_API + '/v1/payments/payment/' + paymentID +
      '/execute',
      {
        auth:
        {
          user: PAYPAL_ID,
          pass: PAYPAL_CLIENT_SECRET
        },
        body:
        {
          payer_id: payerID,
          transactions: [{
            amount: {
              total: req.params.amount,
              currency: 'USD'
            },
            item_list: {
              items: [{
                name: "Donation",
                sku: req.params.sku,
                price: req.params.amount,
                currency: "USD",
                quantity: 1
              }]
            },
            payee: {
                  email: 'info@seaturtles.org'
              },
            description: 'Your donation to SKU Number '+req.params.sku
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

        // SAVE TO DATABASE
        console.log(response.body.id, response.body.payer.payer_info.email, response.body.transactions[0].amount.total, response.body.transactions[0].item_list.items[0].sku)
        client.query(`INSERT INTO orders VALUES ('`+
                            Date.now()+`','`+
                            response.body.transactions[0].item_list.items[0].sku+`',`+
                            response.body.transactions[0].amount.total+`,'`+
                            response.body.payer.payer_info.email+`','`+
                            response.body.id+`','`+
                            ''+`','`+ //amazon_orderid
                            response.body.payer.payer_info.first_name+`','`+
                            response.body.payer.payer_info.last_name+`','`+
                            response.body.create_time+`','`+
                            'Paypal'+`','`+
                            response.body.payer.payer_info.shipping_address.country_code+`','`+
                            response.body.transactions[0].amount.currency+`','`+
                            ''+`','`+ //thankyou_link
                            ''+`','`+ //donation_receipt
                            response.body.create_time+`','`+
                            response.body.payer.payer_info.payer_id+`','`+
                            response.body.payer.payer_info.shipping_address.postal_code+`','`+
                            response.body.transactions[0].payee.email+`');`)

        // 4. Return a success response to the client
        // mixpanel.track('paypal_finished');
        res.json(
        {
          status: 'success',
          response: response.body
        });

      });
  })


  // paypal.configure({
  //   'mode': 'sandbox', //sandbox or live
  //   'client_id': process.env.PAYPAL_ID,
  //   'client_secret': process.env.PAYPAL_CLIENT_SECRET
  // });


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


module.exports = router;