var express = require('express');
var router = express.Router();
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

var content = require('../public/javascripts/content.json')

// var Mixpanel = require('mixpanel');
// var mixpanel = Mixpanel.init('bba2c237fccc04b19cec51dee15cf123');



const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function getData(projectNumber, res){
    
    client.query(` SELECT 
                      skus.sku, 
                      skus.sku_name, 
                      skus.bucket, 
                      skus.description, 
                      skus.unit_cost,
                      skus.total_need,
                      sum(orders.amount) as orderssofar 

                      FROM skus 
                      FULL OUTER JOIN orders ON (skus.sku = orders.sku) 
                      WHERE projectid = '`+projectNumber+`'
                      GROUP BY skus.sku;`, (err, queryResult) => {
                      if(err){console.log(err)}

                      var skuList = []

                      for (let row of queryResult.rows) {
                                // Create an object to save current row's data
                                var sku = {
                                  "sku": row.sku,
                                  'sku_name': row.sku_name,
                                  'bucket': row.bucket,
                                  "description": row.description,
                                  "unit_cost": row.unit_cost,
                                  "donatedsofar": row.orderssofar,
                                  "donatedsofar_pretty": numberWithCommas(row.orderssofar ? parseInt(row.orderssofar) : 0),
                                  "total_need": row.total_need,
                                  "status": (parseInt(row.total_need) - (row.orderssofar ? row.orderssofar : 0) > 0 ? "Active" : "Complete"),
                                  "remaining": parseInt(row.total_need) - (row.orderssofar ? parseInt(row.orderssofar) : 0),
                                  "remaining_pretty": numberWithCommas(parseInt(row.total_need) - (row.orderssofar ? parseInt(row.orderssofar) : 0))
                                }
                                // Add object into array
                                skuList.push(sku);
                            }
                            // console.log(skuList)
                      res.render('project', 
                          { content: content[projectNumber-1],
                            skus: skuList
                          }
                      );
                })
}



router.get('/leatherbacks/', function(req, res, next) {
    getData(1, res)
    // mixpanel.track('leatherbacks_loaded');
});

router.get('/salmon/', function(req, res, next) {
    getData(2, res)
    // mixpanel.track('salmon_loaded');
});


router.get('/microplastics/', function(req, res, next) {
  getData(3, res)
  // mixpanel.track('microplastics_loaded');
});

router.get('/tigersharks/', function(req, res, next) {
  getData(4, res)
  // mixpanel.track('tigersharks_loaded');
});




module.exports = router;