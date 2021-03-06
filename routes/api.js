//external includes
var express = require('express');
var router = express.Router();

//model includes
var Indeed = require('../models/jobs');
var Directions = require('../models/commute');
var Reviews = require('../models/employee_review');
var Skills = require('../models/skills.js');
var Rpp = require('../models/metro_rpp');

//routes
router.get('/search', function(req, res){
  var jobSearchStartLocation = req.query.loc || '312 Arizona Ave, Santa Monica, CA 90401';
  var jobSearchCity = req.query.city || 'Santa Monica';
  var jobSearchState = req.query.state || "CA";
  var jobSearchKeywords = req.query.keywords || ["nodejs"];
  var jobSearchResultsLength = req.query.length || 2;
  var jobSearchRadius = req.query.radius || 25;
  var jobSort = req.query.sort || 'relevance';
  Indeed.findJobs(jobSearchCity, jobSearchState, jobSearchKeywords, jobSearchResultsLength, jobSearchRadius, jobSort)
        .then(Indeed.getSummaries)
        .then(Skills.getSkills)
        .then(Reviews.getEmployeeReview)
        .then(Directions.getLatlon.bind(null, jobSearchStartLocation))
        .then(Directions.getCommuteTimes)
        .then(Rpp.getRpps)
        .then(function(data){
          res.json(data);
        });
  })
  .post('/search', function(req, res){
  var jobSearchStartLocation = req.body.loc || '312 Arizona Ave, Santa Monica, CA 90401';
  var jobSearchCity = req.body.city || 'Santa Monica';
  var jobSearchState = req.body.state || "CA";
  var jobSearchKeywords = [req.body.keywords] || ["nodejs"];
  var jobSearchResultsLength = req.body.length || 2;
  var jobSearchRadius = req.body.radius || 25;
  var jobSort = req.body.sort || 'date';
  Indeed.findJobs(jobSearchCity, jobSearchState, jobSearchKeywords, jobSearchResultsLength, jobSearchRadius, jobSort)
        .then(Indeed.getSummaries)
        .then(Skills.getSkills)
        .then(Reviews.getEmployeeReview)
        .then(Directions.getLatlon.bind(null, jobSearchStartLocation))
        .then(Directions.getCommuteTimes)
        .then(Rpp.getRpps)
        .then(function(data){
          res.json(data);
        });
});

module.exports = router;
