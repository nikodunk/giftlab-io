var express = require('express');
var router = express.Router();
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

var content = require('../public/javascripts/content.json')


function getData(projectNumber, res){
    
    client.query(` SELECT skus.sku, skus.sku_name, skus.bucket, skus.description, skus.status, skus.timeline, skus.priceperunitusd, skus.quantityneeded, skus.totalcostusd, sum(orders.amount) FROM skus 
                      FULL OUTER JOIN orders ON (skus.sku = orders.sku) 
                      WHERE projectid = '`+projectNumber+`'
                      GROUP BY skus.sku;`, (err, queryResult) => {

                      var skuList = []

                      for (let row of queryResult.rows) {
                                // Create an object to save current row's data
                                var sku = {
                                  'sku_name': row.sku_name,
                                  'bucket': row.bucket,
                                  "sku": row.sku,
                                  "description": row.description,
                                  "status": row.status,
                                  "timeline": row.timeline,
                                  "priceperunitusd": row.priceperunitusd,
                                  "quantityneeded": row.quantityneeded,
                                  "totalcostusd": row.totalcostusd,
                                  "donatedsofar": row.sum
                                }
                                // Add object into array
                                skuList.push(sku);
                            }
                                
                      res.render('project', 
                          { content: content[projectNumber],
                            skus: skuList
                          }
                      );
                      client.end();
                      
                      })
}

router.get('/leatherbacks/', function(req, res, next) {
    getData(1, res)
});

router.get('/salmon/', function(req, res, next) {
    getData(2, (result) => {res.render('project', 
                                  { content: content[1],
                                    skus: result
                                  }
                            );
                        } 
    )
});



router.get('/microplastics/', function(req, res, next) {
  client.query(`
                    SELECT skus.sku, skus.sku_name, skus.bucket, skus.description, skus.status, skus.timeline, skus.priceperunitusd, skus.quantityneeded, skus.totalcostusd, sum(orders.amount) FROM skus 
                    FULL OUTER JOIN orders ON (skus.sku = orders.sku) 
                    WHERE projectid = '3'
                    GROUP BY skus.sku;`, (err, queryResult) => {

                    var skuList = []

                    for (let row of queryResult.rows) {
                              // Create an object to save current row's data
                              var sku = {
                                'sku_name': row.sku_name,
                                'bucket': row.bucket,
                                "sku": row.sku,
                                "description": row.description,
                                "status": row.status,
                                "timeline": row.timeline,
                                "priceperunitusd": row.priceperunitusd,
                                "quantityneeded": row.quantityneeded,
                                "totalcostusd": row.totalcostusd,
                                "donatedsofar": row.sum
                              }
                              // Add object into array
                              skuList.push(sku);
                          }

                    console.log(skuList)

                    res.render('project', 
                                { content: content[2],
                                  skus: skuList
                                }
                              );

                    client.end();

                    })
  
});






module.exports = router;