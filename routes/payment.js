var express = require('express');
var router = express.Router();
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

var content = require('../public/javascripts/content.json')

// See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")("sk_test_FufIvJxq2f94m1QAt1T12wMR");


  router.post('/charge/:projectid/:sku/', (req, res) => {
    let token = req.body.stripeToken
    let amount = req.body.stripeAmount
    // console.assert(token)

    stripe.charges.create({
      amount: amount,
      currency: 'usd',
      source: token,
      description: 'Giftlab Charge for '+ req.params.sku,
      // destination: {
      //          amount: amount - 1,
      //          account: "{CONNECTED_STRIPE_ACCOUNT_ID}",
      //         }
    }, (err, charge) => {
      if (err) { res.redirect('/charge/payment-failure?err_msg=' + err.message) } 

      else {
        console.log('Charge successful')
        // console.info(charge)
        console.log('SAVED TO DATABASE:',
                    Date.now(), 
                    req.params.sku, 
                    charge.amount, 
                    charge.source.name,
                    charge.id,
                    Date.now(),
                    'Stripe',
                    charge.source.country,
                    charge.currency,
                    charge.source.address_zip,
                    charge.destination)
        
        client.query(`INSERT INTO orders VALUES ('`+
                            Date.now()+`','`+
                            req.params.sku+`',`+
                            charge.amount +`,'`+
                            charge.source.name +`','`+
                            charge.id +`','`+
                            ''+`','`+ //amazon_orderid
                            '' +`','`+ //first name
                            ''+`','`+ //last name
                            Date.now().toString() +`','`+
                            'Stripe'+`','`+
                            charge.source.country +`','`+
                            charge.currency +`','`+
                            ''+`','`+ //thankyou_link
                            ''+`','`+ //donation_receipt
                            '' +`','`+ //payer id paypal
                            ''+`','`+ //create time paypal
                            charge.source.address_zip+`','`+
                            charge.destination +`');`)


        // res.json(
        // {
        //   status: 'success',
        //   response: charge
        // });
        res.redirect('/payment/success/' + charge.id+'/'+ req.params.projectid)
      }
    })
  })


  router.get('/success/:charge/:projectid', function(req, res, next) {
      res.render('success', 
          { charge: req.params.charge,
            projectid: req.params.projectid,
            content: content
          }
      );
  });


module.exports = router;