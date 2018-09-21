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
    let amount = req.body.stripeAmount
    console.assert(token)
    

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
        console.log('Charged successful')
        console.info(charge)
        console.log('SAVE TO DATABASE:' + req.params.sku, charge.amount, charge.source.name)
        
        client.query(`INSERT INTO orders VALUES ('`+
                            Date.now()+`','`+
                            req.params.sku+`',`+
                            charge.amount +`,'`+
                            charge.source.name +`','`+
                            charge.id +`','`+
                            ''+`','`+ //amazon_orderid
                            '' +`','`+ //first name
                            ''+`','`+ //last name
                            '' +`','`+ // charge.created.toString()
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
        res.redirect('/payment/success/' + charge.id+'/'+ '1')
      }
    })
  })


  router.get('/success/:chargeid/:project', function(req, res, next) {
      res.render('success', 
          { chargeID: req.params.chargeid,
            project: req.params.project
          }
      );
  });


module.exports = router;