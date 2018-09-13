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
  res.render('project', 
              { content: content[2],
                skus: skus
              }
            );
});




module.exports = router;