var express = require('express');
var router = express.Router();
var content = require('../public/javascripts/content.json')
var giftlists = require('../public/javascripts/giftlists.json')
var links = require('../public/javascripts/links.json')

router.get('/leatherbacks/', function(req, res, next) {
  res.render('project', 
              { content: content["leatherbacks"][0],
                giftlist: giftlists["leatherbacks"],
                links: links["leatherbacks"]
              }
            );
});

router.get('/salmon/', function(req, res, next) {
  res.render('project', 
              { content: content["salmon"][0],
  							giftlist: giftlists["salmon"],
  							links: links["salmon"]
              }
            );
});

router.get('/microplastics/', function(req, res, next) {
  res.render('project', 
              { content: content["microplastics"][0],
                giftlist: giftlists["microplastics"],
                links: links["microplastics"]
              }
            );
});



module.exports = router;