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
var stripe = require("stripe")(process.env.STRIPE_LIVE);


  router.post('/charge/:projectid/:sku/:destination', (req, res) => {
    let token = req.body.stripeToken
    let amount = req.body.stripeAmount
    let email = req.body.stripeEmail
    let sku = req.body.stripeSku

    // console.assert(token)

    stripe.charges.create({
      amount: amount,
      currency: 'usd',
      source: token,
      description: 'Giftlab Charge for '+ sku,
      receipt_email: email,
      // application_fee: 1,
    },{
      stripe_account: req.params.destination,
    }, (err, charge) => {
      if (err) { res.redirect('/charge/payment-failure?err_msg=' + err.message) } 

      else {
        console.log('Charge successful')
        console.info(charge)
        var amountInCents = parseInt(charge.amount)
        var amountInDollars = amountInCents / 100
        console.log('SAVED TO DATABASE:',
                    Date.now(), 
                    sku, 
                    amountInDollars.toString(),
                    charge.source.name,
                    charge.id,
                    Date.now(),
                    'Stripe',
                    charge.source.country,
                    charge.currency,
                    charge.source.address_zip,
                    charge.destination)
        
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd;
        } 
        if(mm<10){
            mm='0'+mm;
        } 
        var today = yyyy+'/'+mm+'/'+dd;

        client.query(`INSERT INTO orders VALUES ('`+
                            Date.now()+`','`+
                            sku+`',`+
                            amountInDollars.toString() +`,'`+
                            charge.source.name +`','`+
                            charge.id +`','`+
                            ''+`','`+ //amazon_orderid
                            '' +`','`+ //first name
                            ''+`','`+ //last name
                            today +`','`+
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