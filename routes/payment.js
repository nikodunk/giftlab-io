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
      description: 'Stripe experiment testing charge'
    }, (err, charge) => {
      if (err) { res.redirect('/charge/payment-failure?err_msg=' + err.message) } 

      else {
        console.log('Charged successful')
        console.log('SAVE TO DATABASE:' + req.params.sku, charge.amount, charge.source.name)
        
        // client.query(`INSERT INTO orders VALUES ('`+
        //                     Date.now()+`','`+
        //                     response.body.transactions[0].item_list.items[0].sku+`',`+
        //                     response.body.transactions[0].amount.total+`,'`+
        //                     response.body.payer.payer_info.email+`','`+
        //                     response.body.id+`','`+
        //                     ''+`','`+ //amazon_orderid
        //                     response.body.payer.payer_info.first_name+`','`+
        //                     response.body.payer.payer_info.last_name+`','`+
        //                     response.body.create_time+`','`+
        //                     'Paypal'+`','`+
        //                     response.body.payer.payer_info.shipping_address.country_code+`','`+
        //                     response.body.transactions[0].amount.currency+`','`+
        //                     ''+`','`+ //thankyou_link
        //                     ''+`','`+ //donation_receipt
        //                     response.body.create_time+`','`+
        //                     response.body.payer.payer_info.payer_id+`','`+
        //                     response.body.payer.payer_info.shipping_address.postal_code+`','`+
        //                     response.body.transactions[0].payee.email+`');`)
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