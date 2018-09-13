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
                    GROUP BY skus.sku;
                    `, ((err, rows, fields) => {

                      for (var i = 0; i < rows.length; i++) {

                                // Create an object to save current row's data
                                var sku = {
                                  'sku_name':rows[i].sku_name,
                                }
                                // Add object into array
                                skuList.push(person);
                            }

                      res.render('project', 
                                  { content: content[2],
                                    skus: skuList
                                  }
                                );
                    }))
  
});




module.exports = router;