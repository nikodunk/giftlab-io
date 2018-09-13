var express = require('express');
var router = express.Router();
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

var content = require('../public/javascripts/content.json')
var skus = require('../public/javascripts/skus.json')




router.get('/leatherbacks/', function(req, res, next) {
  res.render('project', 
              { content: content[0],
                skus: skus
              }
            );
});

router.get('/salmon/', function(req, res, next) {
  res.render('project', 
              { content: content[1],
  							skus: skus
              }
            );
});



router.get('/microplastics/', function(req, res, next) {
  client.query(`
                    SELECT skus.sku, skus.sku_name, sum(orders.amount), skus.totalcostusd FROM skus 
                    JOIN orders ON (skus.sku = orders.sku) 
                    WHERE projectid = '3'
                    GROUP BY skus.sku;`, (err, queryResult) => {

                    var skuList = []

                    for (let row of queryResult.rows) {
                              // Create an object to save current row's data
                              var sku = {
                                'sku_name': row.sku_name
                              }
                              // Add object into array
                              skuList.push(sku);
                          }

                    res.render('project', 
                                { content: content[2],
                                  skus: skuList
                                }
                              );

                    client.end();

                    })
  
});






module.exports = router;