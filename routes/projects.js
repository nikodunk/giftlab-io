var express = require('express');
var router = express.Router();
var projects = require('../public/javascripts/projects.json')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('projects');
});

router.get('/leatherbacks/', function(req, res, next) {
  res.render('project', { project: projects["projects"]["leatherbacks"] });
});

router.get('/salmon/', function(req, res, next) {
  res.render('project', { project: projects["projects"]["salmon"] });
});

router.get('/microplastics/', function(req, res, next) {
  res.render('project', { project: projects["projects"]["microplastics"] });
});

module.exports = router;
