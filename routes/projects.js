var express = require('express');
var router = express.Router();
var content = require('../public/javascripts/content.json')
var skus = require('../public/javascripts/skus.json')
var orders = require('../public/javascripts/orders.json')
var pg = require('pg');

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