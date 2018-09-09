var express = require('express');
var router = express.Router();
var content = require('../public/javascripts/content.json')
var giftlists = require('../public/javascripts/giftlists.json')
var links = require('../public/javascripts/links.json')
var pg = require('pg');

router.get('/leatherbacks/', function(req, res, next) {
  res.render('project', 
              { content: content[0],
                giftlist: giftlists["leatherbacks"],
                links: links["leatherbacks"]
              }
            );
});

router.get('/salmon/', function(req, res, next) {
  res.render('project', 
              { content: content[1],
  							giftlist: giftlists["salmon"],
  							links: links["salmon"]
              }
            );
});

router.get('/microplastics/', function(req, res, next) {
  res.render('project', 
              { content: content[2],
                giftlist: giftlists["microplastics"],
                links: links["microplastics"]
              }
            );
});



module.exports = router;